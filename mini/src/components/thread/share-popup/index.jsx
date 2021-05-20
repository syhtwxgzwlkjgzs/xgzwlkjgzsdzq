import React from 'react';
import styles from './index.module.scss';
import { Popup } from '@discuzq/design';
import { noop } from '../utils';
import { View, Text } from '@tarojs/components'

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
      <View className={styles.container}>
        <img src={sharePoint} className={styles.sharePoint} />
        <img src={shareKnow} className={styles.shareKnow} onClick={onClose} />
      </View>
    </Popup>);
};

export default React.memo(SharePopup);
