/**
 * 发帖页标题
 * @prop {string} title 输入标题值
 * @prop {string} placeholder
 * @prop {boolean} show 是否显示标题
 * @prop {function} onChange input事件，输出当前标题值
 * @prop {function} onBlur 失焦事件
 */
import React, { memo } from 'react';
import { View } from '@tarojs/components';
import { Input } from '@discuzq/design';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const Index = ({ value, show, placeholder, onChange, onBlur }) => {
  return (
    <View className={`${styles.container} ${show ? '' : styles['is-display']}`}>
      <Input
        value={value}
        mode='text'
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
      />
    </View>
  );
};

Index.propTypes = {
  value: PropTypes.string,
  show: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

// 设置props默认类型
Index.defaultProps = {
  value: '',
  show: true,
  placeholder: '标题(可选)',
  onChange: () => { },
  onBlur: () => { },
};

export default memo(Index);
