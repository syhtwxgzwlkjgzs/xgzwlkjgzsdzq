import React from 'react';
import { inject, observer } from 'mobx-react';
import InstantMessage from './instant-message';

const H5MyPage = inject('site')(observer(() => {

  const doSubmit = (val) => {
    console.log(`${val} is submitted!`);
    return true;
  }

  return (
    <InstantMessage messageHistory={[]} onSubmit={doSubmit} persona={"myself"}/>
  );
}));

export default H5MyPage;
