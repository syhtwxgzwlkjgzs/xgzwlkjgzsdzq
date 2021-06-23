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
  const { site: { platform }, dialogId, username, nickname, message, threadPost, user } = props;
  const { clearMessage, readDialogMsgList, createDialogMsg, createDialog, readDialogIdByUsername, dialogMsgList, dialogMsgListLength, updateDialog } = message;

  const dialogBoxRef = useRef();
  const timeoutId = useRef();
  const uploadRef = useRef();
  const uploadingImagesRef = useRef([]);

  const [showEmoji, setShowEmoji] = useState(false);
  const [typingValue, setTypingValue] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  // 消息框滚动条滚动到底部
  const scrollEnd = () => {
    if (dialogBoxRef.current) {
      dialogBoxRef.current.scrollTop = dialogBoxRef?.current?.scrollHeight;
    }
  };

  // 每5秒轮询一次
  const updateMsgList = () => {
    readDialogMsgList(dialogId);
    clearPolling();
    timeoutId.current = setTimeout(() => {
      updateMsgList();
    }, 20000);
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

  const submitEmptyImage = (dialogId) => createDialogMsg({
    dialogId,
    isImage: true,
  });

  // 触发图片选择
  const uploadImage = () => {
    uploadRef.current.click();
  };

  // 图片上传之前，true-允许上传，false-取消上传
  const beforeUpload = (cloneList) => {
    const { webConfig } = props.site;
    if (!webConfig) return false;

    const file = cloneList[0];
    const { supportImgExt, supportMaxSize } = webConfig.setAttach;
    const imageType = file.name.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
    const imageSize = file.size;
    const isLegalType = supportImgExt.toLocaleLowerCase().includes(imageType);
    const isLegalSize = imageSize > 0 && imageSize < supportMaxSize * 1024 * 1024;

    if (!isLegalType) {
      Toast.info({ content: `仅支持${supportImgExt}类型的图片` });
      return false;
    }

    if (!isLegalSize) {
      Toast.info({ content: `仅支持0 ~ ${supportMaxSize}MB的图片` });
      return false;
    }

    return true;
  };

  const onImgChange = async (e) => {
    const { files } = e.target;
    // if (!beforeUpload(files)) {
    //   uploadRef.current.value = '';
    //   return; // 图片上传前校验
    // }
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
    await Promise.all(fileList.map(() => submitEmptyImage(dialogId || localDialogId))).then((results) => {
      results.sort((a, b) => b.data.dialogMessageId - a.data.dialogMessageId);
      fileList.map(async (file, i) => {
        const { code, data: { dialogMessageId } } = results[i];
        if (code === 0) {
          file.dialogMessageId = dialogMessageId;
          setTimeout(async () => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 1);
            formData.append('dialogMessageId', dialogMessageId);
            const ret = await createAttachment(formData);
            readDialogMsgList(dialogId);
          }, i * 5000);

          // const { code, data } = ret;
          // if (code === 0) {
          //   // await submit({
          //   //   imageUrl: data.url,
          //   //   isImage: true,
          //   // });
          // } else {
          //   // Toast.error({ content: ret.msg });
          // }
        }
        return file;
      });
      uploadingImagesRef.current = uploadingImagesRef.current.concat(fileList);

      if (!dialogId) {
        replaceRouteWidthDialogId(localDialogId);
      } else {
        readDialogMsgList(dialogId);
      }
    });
  };

  const doSubmitClick = async () => {
    if (!typingValue.trim()) return;
    submit({ messageText: typingValue, isImage: false });
  };

  const messagesList = useMemo(() => {
    setTimeout(() => {
      scrollEnd();
      // 把消息状态更新为已读
      updateDialog(dialogId);
    }, 100);
    return dialogMsgList.list.map(item => {
      if (item.isImageLoading && uploadingImagesRef.current.length) {
        uploadingImagesRef.current.forEach(file => {
          if (file.dialogMessageId === item.id) {
            item.imageUrl = URL.createObjectURL(file);
          }
        });
      }

      return {
        timestamp: item.createdAt,
        userAvatar: item.user.avatar,
        displayTimePanel: true,
        textType: 'string',
        text: item.messageTextHtml,
        ownedBy: user.id === item.userId ? 'myself' : 'itself',
        imageUrl: item.imageUrl,
        userId: item.userId,
        nickname: item.user.username,
        isImageLoading: item.isImageLoading,
      };
    }).filter(item => item.imageUrl || item.text).reverse();
  // }, [dialogMsgListLength]);
  });

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

  useEffect(() => {
    document.addEventListener('focusin', () => {
      setTimeout(scrollEnd, 0);
    });
    return () => {
      clearPolling();
      clearMessage();
    };
  }, []);

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
    <div className={platform === 'h5' ? styles.h5Page : styles.pcPage}>
      <input
        style={{ display: 'none' }}
        type="file"
        multiple="multiple"
        ref={uploadRef}
        onChange={onImgChange}
        accept={ACCEPT_IMAGE_TYPES.join(',')}
      />
      <DialogBox
        ref={dialogBoxRef}
        messagesList={messagesList}
        nickname={nickname}
        platform={platform}
        dialogId={dialogId}
        showEmoji={showEmoji}
        username={username}
        scrollEnd={scrollEnd}
      />
      <InteractionBox
        typingValue={typingValue}
        setTypingValue={setTypingValue}
        uploadImage={uploadImage}
        doSubmitClick={doSubmitClick}
        nickname={nickname}
        username={username}
        platform={platform}
        dialogId={dialogId}
        showEmoji={showEmoji}
        setShowEmoji={setShowEmoji}
      />
    </div>
  );
};

export default inject('message', 'site', 'threadPost', 'user')(observer(Index));
