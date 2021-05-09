import React from 'react';
import { inject, observer } from 'mobx-react';
import InstantMessaging from './instant-messaging';

const H5MyPage = inject('site')(observer(() => {

  const doSubmit = (val) => {
    console.log(`${val} is submitted!`);
    return true;
  }

  return (
    <InstantMessaging messageHistory={[]} onSubmit={doSubmit} persona={"myself"}/>
  );
}));

export default H5MyPage;
