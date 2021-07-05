import React, { useState, useRef } from 'react';
import { Button, Textarea, Icon, Input } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Emoji from '@components/editor/emoji';
import styles from './index.module.scss';

const InteractionBox = (props) => {
  const {
    threadPost,
    showEmoji,
    setShowEmoji,
    setTypingValue,
    uploadImage,
    doSubmitClick,
    typingValue,
    site: { isPC },
    scrollEnd,
  } = props;

  const [cursorPosition, setCursorPosition] = useState(0);

  const inputBoxRef = useRef();


  const recordCursor = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const doPressEnter = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    doSubmitClick();
  };

  const insertEmoji = (emoji) => {
    const text = typingValue.slice(0, cursorPosition) + emoji.code + typingValue.slice(cursorPosition);
    setTypingValue(text);
    setCursorPosition(cursorPosition + emoji.code.length);
  };

  return (
    <>
      {!isPC && (
        <>
          <div className={styles.h5InteractionBox} style={{ bottom: showEmoji ? '200px' : 0 }} ref={inputBoxRef}>
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
                onFocus={() => {
                  setTimeout(() => {
                    inputBoxRef.current.scrollIntoViewIfNeeded(false);
                    setTimeout(() => {
                      scrollEnd();
                    }, 300);
                  }, 100);
                }}
              />
              <div className={styles.tools}>
                <div>
                  <Icon name="SmilingFaceOutlined" size={20} onClick={(e) => {
                    e.stopPropagation();
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
      {isPC && (
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
              <Icon name="SmilingFaceOutlined" size={20} onClick={(e) => {
                e.stopPropagation();
                setShowEmoji(!showEmoji);
              }} />
            </div>
            <div className={styles.pictureUpload}>
              <Icon name="PictureOutlinedBig" size={20} onClick={uploadImage} />
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

export default inject('threadPost', 'site')(observer(InteractionBox));
