import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Button } from '@discuzq/design';

const H5MyPage = inject('site')(observer(() => {
  const test = () => {};

  return (
    <div className={styles.container}>
      <Button onClick={test}>h5 test</Button>
    </div>
  );
}));

export default H5MyPage;
