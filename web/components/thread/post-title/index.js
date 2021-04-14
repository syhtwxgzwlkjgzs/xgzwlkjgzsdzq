/**
 * 发帖页标题
 */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { Input } from '@discuzq/design';
import '@discuzq/design/styles/index.scss';

import styles from './index.module.scss';
import PropTypes from 'prop-types';

const PostTitle = ({ title, placeholder, isDisplay, onChange }) => {
  // state 标题值
  const [titleVal, setTitleVal] = useState('');

  // hooks
  useEffect(() => {
    // 设置标题回显
    setTitleVal(title);
  }, []);

  useEffect(() => {
    // 监听titleVal
    onChange && onChange(titleVal);
  }, [titleVal]);

  // handle
  const updateTitleVal = useCallback((e) => {
    // 更新titleVal
    setTitleVal(e.target.value);
  });

  return (
    <Input
      className={`${styles.title} ${isDisplay ? styles['is-display'] : ''}`}
      value={titleVal}
      placeholder={placeholder}
      onChange={(e) => {
        updateTitleVal(e);
      }}
    />
  );
};

PostTitle.propTypes = {
  title: PropTypes.string,
  isDisplay: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

// 设置props默认类型
PostTitle.defaultProps = {
  title: '',
  isDisplay: false,
  placeholder: '标题(可选)',
};

export default memo(PostTitle);
