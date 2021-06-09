import React, { useState, useRef, useEffect } from 'react';
import { View } from '@tarojs/components';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Input from '@discuzq/design/dist/components/input/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Router from '@discuzq/sdk/dist/router';
import { Emoji } from '@components/thread-post';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

const InteractionBox = (props) => {
  const { dialogId, threadPost, showEmoji, setShowEmoji, username, updateDialogId } = props;
  const { readDialogMsgList, dialogMsgList, createDialogMsg, createDialog, readDialogIdByUsername } = props.message;

  // const [dialogId, setDialogId] = useState(propsDialogId);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [typingValue, setTypingValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  // const [showEmoji, setShowEmoji] = useState(false);

  const [isSubmiting, setIsSubmiting] = useState(false);

  let toastInstance = null;


  const uploadRef = useRef();

  // const checkToShowCurrentMsgTime = (curTimestamp) => {
  //   const DISPLAY_GAP_IN_MINS = 3;
  //   const diff = new Date(curTimestamp).getMinutes() - new Date(lastTimestamp).getMinutes();
  //   if (diff < DISPLAY_GAP_IN_MINS) {
  //     return false;
  //   // eslint-disable-next-line no-else-return
  //   } else {
  //     setLastTimestamp(curTimestamp);
  //     return true;
  //   }
  // };
  const replaceRouteWidthDialogId = (dialogId) => {
    updateDialogId(dialogId);
    // Router.replace({ url: `/subPages/message/index?page=chat&username=${username}&dialogId=${dialogId}` });
  };


  useEffect(async () => {
    if (username && !dialogId) {
      const res = await readDialogIdByUsername(username);
      const { code, data: { dialogId } } = res;
      if (code === 0 && dialogId) {
        replaceRouteWidthDialogId(dialogId);
      }
    }

    if (!threadPost.emojis.length) {
      threadPost.fetchEmoji();
    }
    return () => {
      toastInstance?.destroy();
    };
  }, []);

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
      toastInstance?.destroy();
      if (ret.code === 0) {
        setTypingValue('');
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
        setTypingValue('');
        replaceRouteWidthDialogId(ret.data.dialogId);
      } else {
        Toast.error({ content: ret.msg });
      }
    }
  };

  const doSubmitClick = async () => {
    setShowEmoji(false);
    if (!typingValue.trim()) return;
    submit({ messageText: typingValue });
  };

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
    const files = e.target.files;
    if (!beforeUpload(files)) {
      uploadRef.current.value = '';
      return; // 图片上传前校验
    }

    toastInstance = Toast.loading({
      content: '图片发送中...',
      duration: 0,
    });
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('type', 1);
    const ret = await createAttachment(formData);
    const { code, data } = ret;
    if (code === 0) {
      await submit({ imageUrl: data.url });
    } else {
      Toast.error({ content: ret.msg });
    }
    uploadRef.current.value = '';
  }

  const insertEmoji = (emoji) => {
    const text = typingValue.slice(0, cursorPosition) + emoji.code + typingValue.slice(cursorPosition);
    setTypingValue(text);
    setCursorPosition(cursorPosition + emoji.code.length);
  };

  return (
    <>
      <View className={styles.interactionBox} style={{ bottom: showEmoji ? '333px' : 0 }}>
        <View className={styles.inputWrapper}>
          <Input
            value={typingValue}
            placeholder=" 请输入内容"
            onChange={(e) => {
              setTypingValue(e.detail.value);
              setCursorPosition(e.detail.cursor);
            }}
            onBlur={(e) => {
              setCursorPosition(e.detail.cursor);
            }}
          />
          <View className={styles.tools}>
            <View>
              <Icon name="SmilingFaceOutlined" size={20} color={'var(--color-text-secondary)'} onClick={() => {setShowEmoji(!showEmoji)}} />
            </View>
            <View className={styles.pictureUpload}>
              <Icon name="PictureOutlinedBig" size={20} color={'var(--color-text-secondary)'} />
            </View>
          </View>
        </View>
        <View className={styles.submit}>
          <Button className={styles.submitBtn} type="primary" onClick={doSubmitClick}>
            发送
          </Button>
        </View>
      </View>
      <View className={styles['emoji-container']}>
        <Emoji show={showEmoji} onClick={insertEmoji} />
      </View>
    </>
  );
};

export default inject('message', 'user', 'threadPost', 'site')(observer(InteractionBox));
