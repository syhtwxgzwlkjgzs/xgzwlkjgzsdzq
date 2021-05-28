import React, { createElement, useState, useRef, useEffect } from 'react';
import { Button, Textarea, Icon, Input, Upload } from '@discuzq/design';
import ImageUpload from '@components/thread-post/image-upload';
import { ATTACHMENT_TYPE, ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';
// import Upload from '@components/upload';
import { createAttachment } from '@common/server';
import { inject, observer } from 'mobx-react';
import Emoji from '@components/editor/emoji';

import styles from './index.module.scss';

const InteractionBox = (props) => {
  const { onSubmit, dialogBoxRef, platform, dialogId, threadPost, showEmoji, setShowEmoji, username } = props;
  const { readDialogMsgList, dialogMsgList, createDialogMsg, createDialog } = props.message;

  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [typingValue, setTypingValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  // const [showEmoji, setShowEmoji] = useState(false);


  const uploadRef = useRef(null);

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
  }, []);


  const submit = async (data) => {
    let ret = {};
    if (dialogId) {
      ret = await createDialogMsg({
        dialogId,
        ...data,
      });
    }

    if (!dialogId && username) {
      ret = await createDialog({
        recipientUsername: username,
        ...data,
      });
    }

    if (ret.code === 0) {
      setTypingValue('');
      readDialogMsgList(dialogId);
    }
  };

  const doSubmitClick = async () => {
    if (!typingValue) return;
    submit({messageText: typingValue});
  };

  const doPressEnter = (e) => {
    if (e.key !== 'Enter') return;
    doSubmitClick();
  };


  // 触发图片选择
  const uploadImage = () => {
    uploadRef.current.click();
  };

  const recordCursor = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  return (
    <>
      <input
        style={{display: 'none'}}
        type="file"
        ref={uploadRef}
        onChange={async (e) => {
          const formData = new FormData();
          formData.append('file', e.target.files[0]);
          formData.append('type', 1);
          const ret = await createAttachment(formData);
          const { code, data } = ret;
          if (code === 0) {
            const url = `https://discuzv3-dev.dnspod.dev/${data.file_path}${data.attachment}`;
            submit({imageUrl: url});
          } else {

          }
        }}
        // multiple='1'
        accept={ACCEPT_IMAGE_TYPES.join(',')}
      />

      {platform === 'h5' && (
        <>
          <div className={styles.h5InteractionBox} style={{bottom: showEmoji ? '200px' : 0}}>
          <div className={styles.inputWrapper}>
            <Input value={typingValue} placeholder=" 请输入内容" onChange={(e) => {
              setTypingValue(e.target.value);
              recordCursor(e);
            }} onBlur={(e) => {
              recordCursor(e);
            }} />
            <div className={styles.tools}>
              <div>
                <Icon name="SmilingFaceOutlined" size={20} onClick={() => {setShowEmoji(!showEmoji);}} />
              </div>
              <div className={styles.pictureUpload}>
                <Icon name="PictureOutlinedBig" size={20} onClick={uploadImage} />
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
            show={showEmoji}
            emojis={threadPost.emojis}
            onClick={
              (emoji) => {
                const text = typingValue.slice(0, cursorPosition) + emoji.code + typingValue.slice(cursorPosition);
                setTypingValue(text);
                setCursorPosition(cursorPosition + emoji.code.length);
                setShowEmoji(!showEmoji);
              }}
            />
          </div>
        </>
      )}
      {platform === 'pc' && (
        <div className={styles.pcInteractionBox}>
          <div className={styles.tools}>
            <div className={styles.emoj}>
              <Icon name="SmilingFaceOutlined" size={20} />
            </div>
            <div className={styles.pictureUpload}>
              <Upload
                handleUploadChange={() => {}}
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
            onChange={(e) => setTypingValue(e.target.value)}
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

export default inject('message', 'user', 'threadPost')(observer(InteractionBox));
