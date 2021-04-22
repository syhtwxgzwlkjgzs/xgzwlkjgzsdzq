/**
 * 发帖页标题
 * @prop {string} title 输入标题值
 * @prop {string} placeholder
 * @prop {boolean} show 是否显示标题
 * @prop {function} onInput input事件，输出当前标题值
 */
import React, { memo, useState, useEffect } from 'react';
import { View, Input } from '@tarojs/components';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const Title = ({ title, placeholder, show, onInput }) => {
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
    <View className={styles.container}>
      <View className={styles['container-inner']}>
        <Input
          className={`${styles.title} ${show ? '' : styles['is-display']}`}
          type="text"
          value={titleVal}
          placeholder={placeholder}
          placeholderStyle='color:#c5c6ca'
          onInput={e => setTitleVal(e.target.value)}
        />
      </View>
    </View>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  placeholder: PropTypes.string,
  onInput: PropTypes.func,
};

// 设置props默认类型
Title.defaultProps = {
  title: '',
  show: true,
  placeholder: '标题(可选)',
  onInput: () => { }
};

export default memo(Title);
