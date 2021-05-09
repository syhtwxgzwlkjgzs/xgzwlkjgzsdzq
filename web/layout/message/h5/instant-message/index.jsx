import React, { useEffect, useState } from 'react';
import { Button, Textarea, Icon } from '@discuzq/design';

import styles from './index.module.scss';

const InstantMessage = (props) => {
  const { messageHistory = {}, onSubmit, persona = 'itself' } = props;

  const [messages, setMessages] = useState(messageHistory);
  const [typingValue, setTypingValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  const doSubmitClick = async (e) => {
    if (!typingValue || typeof onSubmit !== 'function') return;
    try {
      setLoading(true);
      const success = await onSubmit(typingValue);
      if (success) {
        setMessages([...messages, typingValue]);
        setTypingValue('');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const doPressEnter = (e) => {
    if (e.key !== 'Enter') return;
    doSubmitClick();
  };

  return (
    <>
      <div className={styles.dialogBox}>
        {messages.map((val, idx) => (
          <div className={ (persona === 'myself' ? `${styles.myself}` : 
            `${styles.itself}`) + ` ${styles.persona}`}>

            <div className={styles.profileIcon}>
              <Icon name="UserOutlined" size={20} color={'var(--color-primary)'} />
            </div>
            <div key={idx} className={styles.msgContent}>{val}</div>

          </div>
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

export default InstantMessage;
