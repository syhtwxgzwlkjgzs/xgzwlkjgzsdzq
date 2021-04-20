import React, { useState } from 'react';
import styles from './index.module.scss';
import { Popup } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 筛选分类组件
 * @prop {boolean} visible 是否分享弹框
 * @prop {function} onClose 弹框关闭事件
 */
const SharePopup = (visible = true, onClose = noop) => {
  const logoImg = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201408%2F30%2F20140830180834_XuWYJ.png&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620908425&t=673ddda42973b103faf179fc02818b41';
  return (
    <Popup
      position="top"
      visible={visible}
      onClose={onClose}
    >
      <div className={styles.container}>
        <img src={logoImg} alt className={styles.sharePoint} />
        <img src={logoImg} alt className={styles.shareKnow} />
      </div>
    </Popup>);
};

export default SharePopup;
