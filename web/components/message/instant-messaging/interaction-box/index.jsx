import React, { createElement, useState } from 'react';
import { Button, Textarea, Icon, Input, Upload } from '@discuzq/design';
import ImageUpload from '@components/thread-post/image-upload';
import { ATTACHMENT_TYPE, ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';
// import Upload from '@components/upload';

import styles from './index.module.scss';

const InteractionBox = (props) => {
  const { onSubmit, dialogBoxRef, platform } = props;
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [typingValue, setTypingValue] = useState('');

  const scrollEnd = () => {
    dialogBoxRef.current.scrollTop = dialogBoxRef.current.scrollHeight;
  };

  const checkToShowCurrentMsgTime = (curTimestamp) => {
    const DISPLAY_GAP_IN_MINS = 3;
    const diff = new Date(curTimestamp).getMinutes() - new Date(lastTimestamp).getMinutes();
    if (diff < DISPLAY_GAP_IN_MINS) {
      return false;
    // eslint-disable-next-line no-else-return
    } else {
      setLastTimestamp(curTimestamp);
      return true;
    }
  };

  const doSubmitClick = async () => {
    if (!typingValue || typeof onSubmit !== 'function') return;
    const currentTime = new Date().getTime();
    const msgPiece = {
      timestamp: currentTime,
      displayTimePanel: checkToShowCurrentMsgTime(currentTime),
      textType: 'string',
      text: typingValue,
      ownedBy: 'myself',
    };

    try {
      const success = await onSubmit(msgPiece);
      if (success) {
        setTypingValue('');
        scrollEnd();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doPressEnter = (e) => {
    if (e.key !== 'Enter') return;
    doSubmitClick();
  };


  // 发送图片
  const uploadImage = (
    <Upload
      accept={ACCEPT_IMAGE_TYPES.join(',')}
      limit={1}
      fileList={[]}
      onComplete={() => {
        debugger;
      }}
      onChange={(e) => {
        console.log(e);
        debugger;
      }}
      isCustomUploadIcon={true}
    >
      <Icon name="PictureOutlinedBig" size={20} />
    </Upload>
  );

  return (
    <>
      {platform === 'h5' && (
        <div className={styles.h5InteractionBox}>
          <div className={styles.inputWrapper}>
            <Input value={typingValue} placeholder=" 请输入内容" onChange={(e) => setTypingValue(e.target.value)} />
            <div className={styles.tools}>
              <div>
                <Icon name="SmilingFaceOutlined" size={20} />
              </div>
              <div className={styles.pictureUpload}>
                {uploadImage}
              </div>
            </div>
          </div>
          <div className={styles.submit}>
            <Button type="primary" onClick={doSubmitClick}>
              发送
            </Button>
          </div>
        </div>
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
                <Icon name="PictureOutlinedBig" size={20} />
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

export default InteractionBox;
