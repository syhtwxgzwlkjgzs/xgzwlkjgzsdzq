import React, { useEffect, useState, useRef } from 'react';
import { Button, Textarea, Icon } from '@discuzq/design';

import styles from './index.module.scss';

const InstantMessaging = (props) => {
  const { messagesHistory = [], onSubmit, persona = 'itself' } = props;

  const [messages, setMessages] = useState(messagesHistory);
  const [typingValue, setTypingValue] = useState('');
  const [lastTimestamp, setLastTimestamp] = useState(0);

  const dialogBoxRef = useRef();

  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  const checkToShowCurrentMsgTime = (curTimestamp) => {
    const displayGapInMins = 3,
          diff = new Date(curTimestamp).getMinutes() - new Date(lastTimestamp).getMinutes();
    if (diff < displayGapInMins) {
      return false;
    } else {
      setLastTimestamp(curTimestamp);
      return true;
    }
  }

  const scrollEnd = () => {
    dialogBoxRef.current.scrollTop = dialogBoxRef.current.scrollHeight;
  }

  const doSubmitClick = async () => {
    if (!typingValue || typeof onSubmit !== 'function') return;

    const currentTime = new Date().getTime(),
          msgPiece = {
            timestamp: currentTime,
            displayTimePanel: checkToShowCurrentMsgTime(currentTime),
            textType: "string",
            text: typingValue
          };

    try {
      const success = await onSubmit(msgPiece);
      if (success) {
        setMessages([...messages, msgPiece]);
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

  const formatMsgDate = (timestamp) => {
    const date = new Date(timestamp),
          m = date.getMonth() + 1,
          d = date.getDate();
    return (m<10 ? "0" + m : m) + "-" + (d<10 ? "0" + d : d) + " " + date.toTimeString().substr(0, 5);
  }

  const displayMsgTime = (curTimestamp) => {
    const formattedDate = formatMsgDate(curTimestamp);
    console.log(formattedDate);
    return <div className={styles.msgTime}>{formattedDate}</div>;
  }

  return (
    <>
      <div className={styles.dialogBox} ref={dialogBoxRef}>
        {messages.map(({timestamp, displayTimePanel, text}, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && displayMsgTime(timestamp)}
            {/* {displayMsgTime(timestamp, (idx > 0) ? messages[idx - 1] : 0)} */}
            <div className={(persona === 'myself' ? `${styles.myself}` : 
              `${styles.itself}`) + ` ${styles.persona}`}>
              <div className={styles.profileIcon}>
                <Icon name="UserOutlined" size={20} color={'var(--color-primary)'} />
              </div>
              <div className={styles.msgContent}>{text}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.interactionBox}>
        <div className={styles.tools}>
          <div className={styles.emoj}>
            <Icon name="SmilingFaceOutlined" size={20} color={'var(--color-text-secondary)'}/>
          </div>
          <div className={styles.pictureUpload}>
            <Icon name="PictureOutlinedBig" size={20} color={'var(--color-text-secondary)'}/>
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
          placeholder={" 请输入内容"}
        />
        <div className={styles.submit}>
          <Button className={styles.submitBtn} type="primary" onClick={doSubmitClick}>
            发送
          </Button>
        </div>
      </div>
    </>
  );
};

export default InstantMessaging;
