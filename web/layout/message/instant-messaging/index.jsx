import React, { useRef } from 'react';

import DialogBox from './dialog-box';
import InteractionBox from './interaction-box';

const InstantMessaging = (props) => {
  const { messagesHistory = [], onSubmit, persona = 'itself' } = props;
  const dialogBoxRef = useRef();

  return (
    <>
      <DialogBox shownMessages={messagesHistory} persona={persona} dialogBoxRef={dialogBoxRef} />
      <InteractionBox onSubmit={onSubmit} dialogBoxRef={dialogBoxRef} />
    </>
  );
};

export default InstantMessaging;
