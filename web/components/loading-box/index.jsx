import React from 'react';
import { Spin } from '@discuzq/design';
import styles from './index.module.scss';

export default function LoadingBox(props) {
  return (
    <div className={styles.loadingBox} style={props.style || {}}>
      <Spin type={'spinner'} size={24}/>
      {props.children}
    </div>
  );
}
