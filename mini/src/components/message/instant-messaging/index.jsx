import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View } from '@tarojs/components';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import DialogBox from './dialog-box';
import InteractionBox from './interaction-box';
import styles from './index.module.scss';
import constants from '@common/constants';
import locals from '@common/utils/local-bridge';
import { getMessageImageSize } from '@common/utils/get-message-image-size';
import { getMessageTimestamp } from '@common/utils/get-message-timestamp';
import calcCosImageQuality from '@common/utils/calc-cos-image-quality';

const Index = ({ message, user, site: { webConfig, envConfig }, dialogId: _dialogId, username, nickname, threadPost }) => {

  const { clearMessage, readDialogMsgList, dialogMsgList, updateDialog, createDialogMsg, createDialog, readDialogIdByUsername } = message;
  const { supportImgExt, supportMaxSize } = webConfig?.setAttach;

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [dialogId, setDialogId] = useState(_dialogId);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [typingValue, setTypingValue] = useState('');

  const uploadingImagesRef = useRef([]);
  const listDataLengthRef = useRef(0);

  const scrollEnd = () => {
    setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 30000,
        duration: 0
      });
    }, 0);
  };

  const doSubmitClick = async () => {
    setShowEmoji(false);
    if (!typingValue.trim()) return;
    submit({ messageText: typingValue, isImage: false });
  };

  const submit = async (data) => {
    if (isSubmiting) return;
    let ret = {};
    if (dialogId) {
      setIsSubmiting(true);
      ret = await createDialogMsg({
        dialogId: parseInt(dialogId),
        ...data,
      });
      setIsSubmiting(false);
      Taro.hideLoading();
      if (ret.code === 0) {
        if (!data.imageUrl) setTypingValue('');
        readDialogMsgList(dialogId);
      } else {
        Toast.error({ content: ret.msg });
      }
    }

    if (!dialogId && username) {
      setIsSubmiting(true);
      ret = await createDialog({
        recipientUsername: username,
        ...data,
      });
      setIsSubmiting(false);
      Taro.hideLoading();
      if (ret.code === 0) {
        if (!data.imageUrl) setTypingValue('');
        setDialogId(ret.data.dialogId);
      } else {
        Toast.error({ content: ret.msg });
      }
    }
  };

  // ????????????????????????
  const submitEmptyImage = dialogId => createDialogMsg({
    dialogId: parseInt(dialogId),
    isImage: true,
  });

  // ???????????????????????????
  const checkFile = (file) => {
    if (!webConfig) return false;
    const imageType = file.path.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
    const imageSize = file.size;
    const isLegalType = supportImgExt.toLocaleLowerCase().includes(imageType);
    const isLegalSize = imageSize > 0 && imageSize < supportMaxSize * 1024 * 1024;
    if (!isLegalType) {
      return '????????????';
    }

    if (!isLegalSize) {
      // Toast.info({ content: `?????????0 ~ ${supportMaxSize}MB?????????` });
      return '????????????';
    }

    return false;
  };

  // ????????????
  const sendImageAttachment = async (file, isResend) => {
    if (file.failMsg) return;
    if (isResend) {
      uploadingImagesRef.current.forEach((item) => {
        if (item.dialogMessageId === file.dialogMessageId) {
          item.isImageFail = false;
          readDialogMsgList(dialogId);
        }
      });
    }

    const token = locals.get(constants.ACCESS_TOKEN_NAME);
    Taro.uploadFile({
      url: `${envConfig.COMMON_BASE_URL}/apiv3/attachments`,
      filePath: file.path,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        'authorization': `Bearer ${token}`
      },
      formData: {
        type: 4,
        dialogMessageId: file.dialogMessageId,
      },
      success(res) {
        if (res.statusCode === 200) {
          const ret = JSON.parse(res.data);
          const { Data: data, Code, Message: msg } = ret;
          if (Code === 0) {

          } else {
            // Toast.error({ content: msg || '??????????????????' });
            file.isImageFail = true;
          }
        } else {
          // Toast.error({ content: '??????????????????' });
          file.isImageFail = true;
        }
        readDialogMsgList(dialogId);
      }
    });
  };

  // ??????????????????
  const chooseImage = () => {
    Taro.chooseImage({
      count: 9,
      success(res) {
        onImgChange(res.tempFiles)
      }
    });
  };

  const onImgChange = async (files) => {
    let localDialogId = 0;
    if (!dialogId) {
      const ret = await createDialog({
        recipientUsername: username,
        isImage: true,
      });
      const { code, data } = ret;
      if (code === 0) {
        localDialogId = data.dialogId;
        setDialogId(data.dialogId);
      }
    }

    // ???????????????????????????????????????????????????????????????
    await Promise.all(files.map(file => {
      new Promise(resolve => {
        Taro.getImageInfo({
          src: file.path,
          complete: ({ width, height, type }) => {
            file.width = width;
            file.height = height;
            file.type = type;
            file.imageUrl = file.path;
            file.failMsg = checkFile(file);
            resolve();
          }
        });
      });
    }));

    Promise.all(files.map(() => submitEmptyImage(dialogId || localDialogId))).then((results) => {
      // ?????????id??????????????????
      results.sort((a, b) => a.data.dialogMessageId - b.data.dialogMessageId);

      // ????????????????????????id????????????
      files.forEach((file, i) => {
        const { code, data: { dialogMessageId } } = results[i];
        if (code === 0) {
          file.dialogMessageId = dialogMessageId;
        }
      });
      // ????????????????????????
      uploadingImagesRef.current = uploadingImagesRef.current.concat(files);
      readDialogMsgList(dialogId || localDialogId).then(() => {
        // clearToast();
      });

      // ??????????????????
      files.map(async (file) => {
        sendImageAttachment(file);
      });

      readDialogMsgList(dialogId || localDialogId);
    });
  };

  const filterTag = (html) =>{
    return html?.replace(/<(\/)?([beprt]|br|div|h\d)[^>]*>|[\r\n]/gi, '');
  }

  const messagesHistory = useMemo(() => {
    setTimeout(() => {
      scrollEnd();
      // ??????????????????????????????
      updateDialog(dialogId);
    }, 100);

    const listData = dialogMsgList.list.map((item) => {
      if (item.isImageLoading && uploadingImagesRef.current.length) {
        uploadingImagesRef.current.forEach((file) => {
          if (file.dialogMessageId === item.id) {
            item = {
              ...item,
              ...file,
              file,
            };
          }
        });
      }

      let [width, height] = [150, 150]; // ??????????????????????????????????????????
      if (item.imageUrl) {
        const size = item.imageUrl.match(/width=(\d+)&height=(\d+)$/);
        if (size) {
          [width, height] = getMessageImageSize(size[1], size[2]); // ????????????????????????
        } else if (item.isImageLoading) {
          [width, height] = getMessageImageSize(item.width, item.height);
        }
      }

      // ???????????????????????????
      if (!item.isImageLoading && item.imageUrl) {
        const [path] = item.imageUrl.split('?');
        const type = path.substr(path.indexOf('.') + 1);
        item.renderUrl = calcCosImageQuality(item.imageUrl, type, 7);
      }

      return {
        ...item,
        timestamp: item.createdAt,
        userAvatar: item.user.avatar,
        displayTimePanel: true,
        textType: 'string',
        text: filterTag(item.messageText),
        ownedBy: user.id === item.userId ? 'myself' : 'itself',
        width: width,
        height: height,
        nickname: item.user.username,
      }
    }).filter(item => (item.imageUrl || item.text)).reverse();

    // ????????????????????????????????????????????????????????????????????????
    if (listData.length > listDataLengthRef.current) {
      listDataLengthRef.current = listData.length;
      setTimeout(() => {
        scrollEnd();
        // ??????????????????????????????
        updateDialog(dialogId);
      }, 100);
    }

    return getMessageTimestamp(listData);
  }, [dialogMsgList]);

  useEffect(async () => {
    if (username && !dialogId) {
      const res = await readDialogIdByUsername(username);
      const { code, data: { dialogId } } = res;
      if (code === 0 && dialogId) {
        setDialogId(dialogId);
      }
    }

    if (!threadPost.emojis.length) {
      threadPost.fetchEmoji();
    }

    return () => {
      Taro.hideLoading();
    };
  }, []);

  useEffect(() => {
    setDialogId(_dialogId);

    // ????????????????????????
    Taro.onKeyboardHeightChange(res => {
      setKeyboardHeight(res?.height || 0);
    });


    return () => {
      clearMessage();
    };
  }, []);

  return (
    <View className={styles.container}>
      <DialogBox
        messagesHistory={messagesHistory}
        scrollEnd={scrollEnd}
        dialogId={dialogId}
        showEmoji={showEmoji}
        sendImageAttachment={sendImageAttachment}
        hideEmoji={() => {
          setShowEmoji(false);
        }}
        keyboardHeight={keyboardHeight}
      />
      <InteractionBox
        doSubmitClick={doSubmitClick}
        typingValue={typingValue}
        setTypingValue={setTypingValue}
        chooseImage={chooseImage}
        username={username}
        keyboardHeight={keyboardHeight}
        showEmoji={showEmoji}
        dialogId={dialogId}
        switchEmoji={(show) => {
          setShowEmoji(show);
        }}
      />
    </View>
  );
};

export default inject('message', 'user', 'threadPost', 'site')(observer(Index));