import React, { useCallback } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
import browser from '@common/utils/browser';

export default function H5Header(props) {
  const { allowJump = true, customJum = () => { } } = props;
  // todo
  const iconClickHandle = useCallback((link) => {
    if (allowJump) {
      Router.push({ url: link });
      return
    };
    customJum(link);
  }, []);

  const goBackClickHandle = useCallback(() => {
    if (allowJump) {
      window.history.length <= 1 ? Router.redirect({ url: '/' }) : Router.back();
      return
    };
    customJum();
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div onClick={goBackClickHandle} className={styles.left}>
          <Icon
            className={browser.env('android') ? styles.icon : ''}
            name="LeftOutlined"
            size={16}
          />
          <div className={styles.text}>返回</div>
        </div>
        <div className={styles.right}>
          <Icon
            className={styles.icon}
            onClick={() => iconClickHandle('/')}
            name="HomeOutlined"
          />
          {false &&
            <Icon
              className={styles.icon}
              onClick={() => iconClickHandle('/my/notice')}
              name="MailOutlined"
            />}
          <Icon
            className={styles.icon}
            onClick={() => iconClickHandle('/my')}
            name="ProfessionOutlined"
          />
        </div>
      </div>
    </div>
  );
}
