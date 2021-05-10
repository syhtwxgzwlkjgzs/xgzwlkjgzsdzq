import React from 'react';
import styles from './index.module.scss';

/**
 * 悬赏问答红包背景
 */

const Index = () => {

  return (
    <div className={styles.container}>
      <img className={styles.coverTop} src='/cover-top.png'/>
      <img className={styles.coverBottom} src='/cover-bottom.png'/>
    </div>
  );
};


export default React.memo(Index);
