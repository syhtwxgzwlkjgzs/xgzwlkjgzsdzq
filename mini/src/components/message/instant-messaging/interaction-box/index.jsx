import React, { useState, useRef, useEffect } from 'react';
import { View } from '@tarojs/components';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Input from '@discuzq/design/dist/components/input/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Router from '@discuzq/sdk/dist/router';
import constants from '@common/constants';
import locals from '@common/utils/local-bridge';
import { Emoji } from '@components/thread-post';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const InteractionBox = (props) => {
  const { dialogId, threadPost, showEmoji, setShowEmoji, username, updateDialogId, keyboardHeight, inputBottom } = props;
  const { readDialogMsgList, dialogMsgList, createDialogMsg, createDialog, readDialogIdByUsername } = props.message;

  // const [dialogId, setDialogId] = useState(propsDialogId);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [typingValue, setTypingValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  // const [showEmoji, setShowEmoji] = useState(false);

  const [isSubmiting, setIsSubmiting] = useState(false);

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

  useEffect(async () => {
    if (username && !dialogId) {
      const res = await readDialogIdByUsername(username);
      const { code, data: { dialogId } } = res;
      if (code === 0 && dialogId) {
        updateDialogId(dialogId);
      }
    }

    if (!threadPost.emojis.length) {
      threadPost.fetchEmoji();
    }

    return () => {
      Taro.hideLoading();
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
        updateDialogId(ret.data.dialogId);
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
  const chooseImage = () => {
    Taro.chooseImage({
      count: 1,
      success(res) {
        onImgChange(res.tempFiles)
      }
    });
  };

  // 图片上传之前，true-允许上传，false-取消上传
  const beforeUpload = (cloneList) => {
    const { webConfig } = props.site;
    if (!webConfig) return false;
    const file = cloneList[0];
    const { supportImgExt, supportMaxSize } = webConfig.setAttach;
    const imageType = file.path.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
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

  const onImgChange = async (files) => {
    // 图片上传前校验
    if (!beforeUpload(files)) return;

    const { envConfig } = props.site;
    const file = files[0];
    const tempFilePath = file.path;
    const token = locals.get(constants.ACCESS_TOKEN_NAME);
    Taro.showLoading({
      title: '图片发送中...',
      mask: true
    });
    Taro.uploadFile({
      url: `${envConfig.COMMON_BASE_URL}/apiv3/attachments`,
      filePath: tempFilePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        'authorization': `Bearer ${token}`
      },
      formData: {
        'type': 1
      },
      success(res) {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data).Data;
          submit({ imageUrl: data.url });
        } else {
          Taro.hideLoading();
          Toast.error({ content: ret.msg });
        }
      },
      fail(res) {
        console.log(res);
      }
    });
  };

  const insertEmoji = (emoji) => {
    const text = typingValue.slice(0, cursorPosition) + emoji.code + typingValue.slice(cursorPosition);
    setTypingValue(text);
    setCursorPosition(cursorPosition + emoji.code.length);
  };

  return (
    <View
      id='operation-box'
      className={styles.interactionBox}
      style={{
        bottom: (keyboardHeight && !showEmoji) ? `${inputBottom}px` : 0,
        // paddingBottom: keyboardHeight ? 0 : '',
       }}>
      <View className={styles.operationBox}>
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
              <Icon name="PictureOutlinedBig" size={20} color={'var(--color-text-secondary)'} onClick={chooseImage} />
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
    </View>
  );
};

export default inject('message', 'user', 'threadPost', 'site')(observer(InteractionBox));
