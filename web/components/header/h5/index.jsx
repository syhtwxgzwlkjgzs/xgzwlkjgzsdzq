import React, { useCallback } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import Router from '@common/utils/web-router';
export default function H5Header() {
  // todo
  const iconClickHandle = useCallback((type) => {
    console.log(type);
  }, []);

  const gobackClickHandle = useCallback(() => {
    Router.back();
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
                }} name="UserOutlined" color="#C4C9D6" size={20} />
            </div>
        </div>
    </div>
  );
}
