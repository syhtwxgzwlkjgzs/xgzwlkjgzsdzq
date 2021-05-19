/**
 * 发帖页标题
 * @prop {string} title 输入标题值
 * @prop {string} placeholder
 * @prop {boolean} show 是否显示标题
 * @prop {function} onInput input事件，输出当前标题值
 * @prop {function} onFocus 聚焦事件
 * @prop {function} onBlur 失焦事件
 */
import React, { memo, useState, useEffect } from 'react';
import { View, Input } from '@tarojs/components';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const Index = ({ title, placeholder, show, onInput, onFocus, onBlur }) => {
  // state 标题值
  const [titleVal, setTitleVal] = useState('');

  // hooks
  useEffect(() => { // 设置标题回显
    title && setTitleVal(title);
  }, []);

  useEffect(() => { // 监听titleVal
    onInput(titleVal);
  }, [titleVal]);

  return (
    <View className={`${styles.container} ${show ? '' : styles['is-display']}`}>
      <View className={styles['container-inner']}>
        <Input
          type="text"
          value={titleVal}
          placeholder={placeholder}
          placeholderStyle='color:#c5c6cb;font-size:20px;'
          onInput={e => setTitleVal(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
};

Index.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  placeholder: PropTypes.string,
  onInput: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

// 设置props默认类型
Index.defaultProps = {
  title: '',
  show: true,
  placeholder: '标题(可选)',
  onInput: () => { },
  onFocus: () => { },
  onBlur: () => { },
};

export default memo(Index);
