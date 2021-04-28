// 主要是用于pc，等后期基础组件优化好之后再去掉
import React from 'react';
import { Icon, Dialog } from '@discuzq/design';
import styles from './index.module.scss';

export default function DDialog(props) {
  const { title, children, onClose = () => {}, className, ...other } = props;
  const header = (
    <div className={styles['pc-header']}>
      {title}
      <Icon
        className={styles['pc-closeicon']}
        name="DeleteOutlined"
        size={12}
        onClick={onClose}
      />
    </div>
  );

  return (
    <Dialog
      className={`${className} ${styles.pc}`}
      header={header}
      onClose={onClose}
      {...other}
    >
      {children}
    </Dialog>
  );
}
