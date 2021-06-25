/* eslint-disable no-else-return */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { inject, observer } from 'mobx-react';
import { Toast } from '@discuzq/design';
import DialogBox from './dialog-box';
import InteractionBox from './interaction-box';
import Router from '@discuzq/sdk/dist/router';
import { createAttachment } from '@common/server';
import { ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';
import styles from './index.module.scss';

const Index = (props) => {
  const { site: { isPC, webConfig }, dialogId, username, nickname, message, threadPost, user } = props;
  const { supportImgExt, supportMaxSize } = webConfig?.setAttach;
  const { clearMessage, readDialogMsgList, createDialogMsg, createDialog, readDialogIdByUsername, dialogMsgList, dialogMsgListLength, updateDialog } = message;

  const dialogBoxRef = useRef();
  const timeoutId = useRef();
  const uploadRef = useRef();
  const uploadingImagesRef = useRef([]);
  const listDataLengthRef = useRef(0);

  let toastInstance = null;

  const [showEmoji, setShowEmoji] = useState(false);
  const [typingValue, setTypingValue] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  // 消息框滚动条滚动到底部
  const scrollEnd = () => {
    if (dialogBoxRef.current) {
      dialogBoxRef.current.scrollTop = dialogBoxRef?.current?.scrollHeight;
    }
  };

  // 每10秒轮询一次
  const updateMsgList = () => {
    readDialogMsgList(dialogId);
    clearPolling();
    timeoutId.current = setTimeout(() => {
      updateMsgList();
    }, 10000);
  };

  // 清除轮询
  const clearPolling = () => clearTimeout(timeoutId.current);

  const replaceRouteWidthDialogId = (dialogId) => {
    Router.replace({ url: `/message?page=chat&nickname=${nickname}&dialogId=${dialogId}` });
  };

  const submit = async (data) => {
    if (isSubmiting) return;
    let ret = {};
    if (dialogId) {
      setIsSubmiting(true);
      ret = await createDialogMsg({
        dialogId,
        ...data,
      });
      setIsSubmiting(false);
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
      if (ret.code === 0) {
        if (!data.imageUrl) setTypingValue('');
        replaceRouteWidthDialogId(ret.data.dialogId);
      } else {
        Toast.error({ content: ret.msg });
      }
    }
  };

  const submitEmptyImage = dialogId => createDialogMsg({
    dialogId,
    isImage: true,
  });

  const clearToast = () => {
    toastInstance?.destroy();
  };

  // 触发图片选择
  const uploadImage = () => {
    uploadRef.current.click();
  };

  // 检查文件类型和体积
  const checkFile = (file) => {
    if (!webConfig) return false;
    const imageType = file.name.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
    const imageSize = file.size;
    const isLegalType = supportImgExt.toLocaleLowerCase().includes(imageType);
    const isLegalSize = imageSize > 0 && imageSize < supportMaxSize * 1024 * 1024;

    if (!isLegalType) {
      return '格式错误';
    }

    if (!isLegalSize) {
      // Toast.info({ content: `仅支持0 ~ ${supportMaxSize}MB的图片` });
      return '体积过大';
    }

    return false;
  };

  const onImgChange = async (e) => {
    const { files } = e.target;
    let localDialogId = 0;
    if (!dialogId) {
      const ret = await createDialog({
        recipientUsername: username,
        isImage: true,
      });
      const { code, data } = ret;
      if (code === 0) {
        localDialogId = data.dialogId;
      }
    }

    const fileList = [...files];

    toastInstance = Toast.loading({
      content: '图片压缩中...',
      duration: 0,
    });

    // 先获取图片本地的路径（base64）、再异步获取图片的宽高
    await Promise.all(fileList.map(file => (
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const src = e.target.result;
          const img = new Image();
          img.src = src;
          img.onload = () => {
            file.imageUrl = src;
            file.imageWidth = img.width;
            file.imageHeight = img.height;
            file.failMsg = checkFile(file);
            resolve();
          };
        };
      })
    )));

    await Promise.all(fileList.map(() => submitEmptyImage(dialogId || localDialogId))).then((results) => {
      // 把消息id从小到大排序
      results.sort((a, b) => a.data.dialogMessageId - b.data.dialogMessageId);

      // 把本地图片和消息id对应起来
      fileList.forEach((file, i) => {
        const { code, data: { dialogMessageId } } = results[i];
        if (code === 0) {
          file.dialogMessageId = dialogMessageId;
        }
      });
      // 维护本地图片队列
      uploadingImagesRef.current = uploadingImagesRef.current.concat(fileList);
      readDialogMsgList(dialogId || localDialogId).then(() => {
        clearToast();
      });

      // 开始上传图片
      fileList.map(async (file) => {
        sendImageAttachment(file, dialogId || localDialogId);
      });

      if (!dialogId) {
        replaceRouteWidthDialogId(localDialogId);
      } else {
        readDialogMsgList(dialogId);
      }
    });
  };

  const sendImageAttachment = async (file, dialogId, isResend) => {
    if (file.failMsg) return;
    if (isResend) {
      uploadingImagesRef.current.forEach((item) => {
        if (item.dialogMessageId === file.dialogMessageId) {
          item.isImageFail = false;
          readDialogMsgList(dialogId);
        }
      });
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 1);
    formData.append('dialogMessageId', file.dialogMessageId);
    const ret = await createAttachment(formData);
    if (ret.code !== 0) file.isImageFail = true;
    readDialogMsgList(dialogId);
  };

  const doSubmitClick = async () => {
    if (!typingValue.trim()) return;
    submit({ messageText: typingValue, isImage: false });
  };

  const messagesList = useMemo(() => {
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
      return {
        ...item,
        timestamp: item.createdAt,
        userAvatar: item.user.avatar,
        displayTimePanel: true,
        textType: 'string',
        text: item.messageTextHtml,
        ownedBy: user.id === item.userId ? 'myself' : 'itself',
        nickname: item.user.username,
      };
    }).filter(item => item.imageUrl || item.text).reverse();

    // 消息数有变化，即有新消息，此时把滚动条滚动到底部
    if (listData.length > listDataLengthRef.current) {
      listDataLengthRef.current = listData.length;
      setTimeout(() => {
        scrollEnd();
        // 把消息状态更新为已读
        updateDialog(dialogId);
      }, 100);
    }

    return listData;
  }, [dialogMsgList]);

  useEffect(async () => {
    clearMessage();
    if (username && !dialogId) {
      const res = await readDialogIdByUsername(username);
      const { code, data: { dialogId } } = res;
      if (code === 0 && dialogId) {
        replaceRouteWidthDialogId(dialogId);
      }
    }
  }, [username, dialogId]);


  useEffect(() => {
    if (!threadPost.emojis.length) {
      threadPost.fetchEmoji();
    }
  }, []);

  useEffect(() => (
    () => {
      clearPolling();
      clearMessage();
      clearToast();
    }
  ), []);

  // 切换username时，停止当前轮询，用于pc端对话页右下角点击切换聊天用户的场景
  useEffect(() => {
    clearPolling();
  }, [username]);

  // 有dialogId开始执行轮询更新消息机制
  useEffect(() => {
    if (dialogId) {
      clearPolling();
      updateMsgList();
    }
  }, [dialogId]);

  // 弹出表情时，消息列表拉到最底下
  useEffect(() => {
    if (showEmoji) {
      setTimeout(scrollEnd, 0);
    }
  }, [showEmoji]);

  return (
    <div className={!isPC ? styles.h5Page : styles.pcPage}>
      <input
        style={{ display: 'none' }}
        type="file"
        multiple="multiple"
        ref={uploadRef}
        onChange={onImgChange}
        accept={supportImgExt ? supportImgExt.split(',').map(str => `image/${str}`).join(',') : 'image/*'}
      />
      <DialogBox
        ref={dialogBoxRef}
        messagesList={messagesList}
        showEmoji={showEmoji}
        scrollEnd={scrollEnd}
        sendImageAttachment={sendImageAttachment}
      />
      <InteractionBox
        scrollEnd={scrollEnd}
        typingValue={typingValue}
        setTypingValue={setTypingValue}
        uploadImage={uploadImage}
        doSubmitClick={doSubmitClick}
        showEmoji={showEmoji}
        setShowEmoji={setShowEmoji}
      />
    </div>
  );
};

export default inject('message', 'site', 'threadPost', 'user')(observer(Index));
