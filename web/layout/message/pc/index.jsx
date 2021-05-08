import React from 'react';
import { inject, observer } from 'mobx-react';

const PCMyPage = inject('site')(observer(() => {
  const test = () => {};

  return (
    <div>
    </div>
  );
}));

export default PCMyPage;
