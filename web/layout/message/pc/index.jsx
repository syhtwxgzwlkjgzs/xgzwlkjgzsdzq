import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Button } from '@discuzq/design';

const PCMyPage = inject('site')(observer(() => {
  const test = () => {};

  return (
    <div className={styles.container}>
      <Button onClick={test}>pc test</Button>
    </div>
  );
}));

export default PCMyPage;
