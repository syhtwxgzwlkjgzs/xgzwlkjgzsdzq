import React from 'react';
import styles from './index.module.scss';

/**
 * 版权信息
 * @prop {sting} copyright 版权信息
 * @prop {string} record 备案信息
 */
const Index = ({copyright, record}) => {
  return (
    <div>
      <div className={styles.text}>{copyright || 'Powered By Discuz! Q © 2021'}</div>
      <div className={styles.text}>{record || '粤ICP备20008502号-1'}</div>
    </div>
  );
};

export default Index;
