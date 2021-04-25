import React, { useCallback } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';

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
            <div onClick={gobackClickHandle} className={styles.left}>返回</div>
            <div className={styles.right}>
                <Icon onClick={() => {
                  iconClickHandle('home');
                }} name="HomeOutlined" color="#C4C9D6" size={20} />
                <Icon onClick={() => {
                  iconClickHandle('msg');
                }} name="MessageOutlined" color="#C4C9D6" size={20} />
                <Icon onClick={() => {
                  iconClickHandle('user');
                }} name="ProfessionOutlined" color="#C4C9D6" size={20} />
            </div>
        </div>
    </div>
  );
}
