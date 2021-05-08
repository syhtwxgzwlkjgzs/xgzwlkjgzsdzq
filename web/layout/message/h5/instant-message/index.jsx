import React, { useEffect, useState } from 'react';
import { Button, Textarea } from '@discuzq/design';

const InstantMessage = (props) => {
  const { messageHistory = {}, onSubmit } = props;

  const [messages, setMessages] = useState(messageHistory);
  const [typingValue, setTypingValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  const onSubmitClick = async (e) => {
    if (typeof onSubmit === 'function') {
      try {
        setLoading(true);
        const success = await onSubmit(typingValue);
        messages.push(typingValue);
        console.log("Msg array: ", messages);
        if (success) setTypingValue('');
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="dialogBox"></div>
      <div className="toolBox">
        <div className="tools"></div>
        <div className="typingArea">
          <Textarea value={typingValue} maxLength={5000} rows={5} onChange={(e) => setTypingValue(e.target.value)} />
        </div>
        <div className="submit">
          <Button type="primary" onClick={onSubmitClick}>
            确认
          </Button>
        </div>
      </div>
    </>
  );
};

export default InstantMessage;
