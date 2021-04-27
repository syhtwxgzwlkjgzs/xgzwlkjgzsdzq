import React, { useMemo } from 'react';
import styles from './index.module.scss';
export default function PCIndex(props) {
  return (
    <div className={styles.redpackBox}>
      <div className={styles.money}>
        <img className={styles.bgImg} src='redpacket.png'/>
      </div>
    </div>
  );
}

