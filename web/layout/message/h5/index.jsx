import React from 'react';
import { inject, observer } from 'mobx-react';
import InstantMessage from './instant-message';

const H5MyPage = inject('site')(observer(() => {
  const test = () => {};

  const doSubmit = async (val) => {
    console.log(`${val} is submitted!`);
    return true;
  }

  return (
    <InstantMessage messageHistory={[]} onSubmit={doSubmit}/>
  );
}));

export default H5MyPage;
