import React, { createElement, useState, useRef, useEffect } from 'react';
import { Button, Textarea, Icon, Input, Upload, Toast } from '@discuzq/design';
import ImageUpload from '@components/thread-post/image-upload';
import { ATTACHMENT_TYPE, ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';
// import Upload from '@components/upload';
import { createAttachment } from '@common/server';
import { inject, observer } from 'mobx-react';
import Emoji from '@components/editor/emoji';
import Router from '@discuzq/sdk/dist/router';
import styles from './index.module.scss';

const InteractionBox = (props) => {
  const { onSubmit, dialogBoxRef, platform, dialogId, threadPost, showEmoji, setShowEmoji, username } = props;
  const { readDialogMsgList, dialogMsgList, createDialogMsg, createDialog } = props.message;

  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [typingValue, setTypingValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  // const [showEmoji, setShowEmoji] = useState(false);

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


  useEffect(() => {
    if (!threadPost.emojis.length) {
      threadPost.fetchEmoji();
    }
    return () => {
      toastInstance?.destroy();
    };
  }, []);


  const submit = async (data) => {
    let ret = {};
    if (dialogId) {
      ret = await createDialogMsg({
        dialogId,
        ...data,
      });
      toastInstance?.destroy();
      if (ret.code === 0) {
        setTypingValue('');
        readDialogMsgList(dialogId);
      } else {
        Toast.error({ content: ret.message });
      }
    }

    if (!dialogId && username) {
      ret = await createDialog({
        recipientUsername: username,
        ...data,
      });
      if (ret.code === 0) {
        setTypingValue('');
        Router.replace({ url: `/message?page=chat&dialogId=${ret.data.dialogId}` });
      } else {
        Toast.error({ content: ret.message });
      }
    }
  };

  const doSubmitClick = async () => {
    if (!typingValue.trim()) return;
    submit({ messageText: typingValue });
  };

  const doPressEnter = (e) => {
    if (e.key !== 'Enter') return;
    doSubmitClick();
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
  }

  const onImgChange = async (e) => {
    const files = e.target.files;
    if (!beforeUpload(files)) return; // 图片上传前校验

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
      submit({ imageUrl: data.url });
    } else {
      Toast.error({ content: ret.message });
    }
  }

  const recordCursor = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const insertEmoji = (emoji) => {
    const text = typingValue.slice(0, cursorPosition) + emoji.code + typingValue.slice(cursorPosition);
    setTypingValue(text);
    setCursorPosition(cursorPosition + emoji.code.length);
  };

  return (
    <>
      <input
        style={{display: 'none'}}
        type="file"
        ref={uploadRef}
        onChange={onImgChange}
        accept={ACCEPT_IMAGE_TYPES.join(',')}
      />

      {platform === 'h5' && (
        <>
          <div className={styles.h5InteractionBox} style={{ bottom: showEmoji ? '200px' : 0 }}>
            <div className={styles.inputWrapper}>
              <Input
                value={typingValue}
                placeholder=" 请输入内容"
                onChange={(e) => {
                  setTypingValue(e.target.value);
                  recordCursor(e);
                }}
                onBlur={(e) => {
                  recordCursor(e);
                }}
              />
              <div className={styles.tools}>
                <div>
                  <Icon name="SmilingFaceOutlined" size={20} onClick={() => {
                    setShowEmoji(!showEmoji);
                  }} />
                </div>
                <div className={styles.pictureUpload}>
                  <Icon name="PictureOutlinedBig" size={20} onClick={() => {
                    uploadImage();
                  }} />
                </div>
              </div>
            </div>
            <div className={styles.submit}>
              <Button type="primary" onClick={doSubmitClick}>
                发送
              </Button>
            </div>
          </div>
          <div className={styles.emoji}>
            <Emoji
              onEmojiBlur={() => setShowEmoji(false)}
              show={showEmoji}
              emojis={threadPost.emojis}
              onClick={insertEmoji}
            />
          </div>
        </>
      )}
      {platform === 'pc' && (
        <div className={styles.pcInteractionBox}>
          <div className={styles.tools}>
            <Emoji
              onEmojiBlur={() => setShowEmoji(false)}
              pc
              show={showEmoji}
              emojis={threadPost.emojis}
              onClick={insertEmoji}
            />
            <div className={styles.emoj}>
              <Icon name="SmilingFaceOutlined" size={20} onClick={() => {
                setShowEmoji(!showEmoji);
              }} />
            </div>
            <div className={styles.pictureUpload}>
              <Upload
                handleUploadChange={() => { }}
                isCustomUploadIcon={true}
              >
                <Icon name="PictureOutlinedBig" size={20} onClick={uploadImage} />
              </Upload>
            </div>
          </div>
          <Textarea
            className={styles.typingArea}
            value={typingValue}
            focus={true}
            maxLength={5000}
            rows={3}
            onChange={(e) => {
              setTypingValue(e.target.value);
              recordCursor(e);
            }}
            onBlur={(e) => {
              recordCursor(e);
            }}
            onKeyDown={doPressEnter}
            placeholder={' 请输入内容'}
          />
          <div className={styles.submit}>
            <Button className={styles.submitBtn} type="primary" onClick={doSubmitClick}>
              发送
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default inject('message', 'user', 'threadPost', 'site')(observer(InteractionBox));
