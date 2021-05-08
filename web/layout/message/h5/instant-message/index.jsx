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
    console.log(persona);
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
          <div className={ (persona === 'myself' ? 
          `${styles.myself}` : 
          `${styles.itself}`) + ` ${styles.persona}`}>
            <Icon name="UserOutlined" size={20} color={'var(--color-primary)'} />
            <div key={idx}>{val}</div>
          </div>
        ))}
      </div>
      <div className="toolBox">
        <div className="tools"></div>
        <div className="typingArea">
          <Textarea
            value={typingValue}
            focus={true}
            maxLength={5000}
            rows={5}
            onChange={(e) => setTypingValue(e.target.value)}
            onKeyDown={doPressEnter}
          />
        </div>
        <div className="submit">
          <Button type="primary" onClick={doSubmitClick}>
            确认
          </Button>
        </div>
      </div>
    </>
  );
};

export default InstantMessage;
