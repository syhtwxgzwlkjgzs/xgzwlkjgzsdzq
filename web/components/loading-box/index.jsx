import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';

export default function LoadingBox(props) {
  return (
    <div className={styles.loadingBox} style={props.style || {}}>
      <Icon className={styles.loading} name="LoadingOutlined" size="large" />
      {props.children}
    </div>
  );
}
