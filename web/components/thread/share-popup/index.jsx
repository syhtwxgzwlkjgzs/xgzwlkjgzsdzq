import React from 'react';
import styles from './index.module.scss';
import { Popup } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 筛选分类组件
 * @prop {boolean} visible 是否分享弹框
 * @prop {function} onClose 弹框关闭事件
 */
const SharePopup = ({ visible = false, onClose = noop }) => {
  const sharePoint = '/dzq-img/sharePoint.png';
  const shareKnow = '/dzq-img/shareKnow.png';
  return (
    <Popup
      position="top"
      visible={visible}
      onClose={onClose}
    >
      <div className={styles.container}>
        <img src={sharePoint} className={styles.sharePoint} />
        <img src={shareKnow} className={styles.shareKnow} />
      </div>
    </Popup>);
};

export default React.memo(SharePopup);
