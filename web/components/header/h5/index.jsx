import React, { useCallback } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
import browser from '@common/utils/browser';

export default function H5Header(props) {
  const { isBackCustom } = props;
  // todo
  const iconClickHandle = useCallback((type) => {
    switch (type) {
      case 'home': Router.push({ url: '/' });
        break;
      case 'msg': Router.push({ url: '/my/notice' });
        break;
      case 'user': Router.push({ url: '/my' });
        break;
    }
  }, []);

  const gobackClickHandle = useCallback(() => {
    let isBack = true;
    if (typeof isBackCustom === 'function') isBack = isBackCustom();
    if (isBack) Router.back();
  }, []);

  return (
    <div className={styles.header}>
        <div className={styles.headerContent}>
            <div onClick={gobackClickHandle} className={styles.left}>
              <Icon className={browser.env('android') ? styles.icon : ''} name="LeftOutlined" size={16} />
              <div className={styles.text}>返回</div>
            </div>
            <div className={styles.right}>
                <Icon className={styles.icon} onClick={() => {
                  iconClickHandle('home');
                }} name="HomeOutlined" />
                <Icon className={styles.icon} onClick={() => {
                  iconClickHandle('msg');
                }} name="MailOutlined" />
                <Icon className={styles.icon} onClick={() => {
                  iconClickHandle('user');
                }} name="ProfessionOutlined" />
            </div>
        </div>
    </div>
  );
}
