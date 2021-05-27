/**
 * 发帖页标题
 * @prop {string} value 绑定值
 * @prop {string} rows 最大行数
 * @prop {string} placeholder 站位内容
 * @prop {string} disabled 是否禁用
 * @prop {string} maxLength 最大长度
 * @prop {string} showLimit 是否显示最大长度，需配合maxLength使用
 * @prop {string} cursorSpacing 指定光标与键盘的距离，单位 px
 * @prop {function} onChange onChange事件，输出当前文本框内容
 * @prop {function} onFocus 聚焦事件
 * @prop {function} onBlur 失焦事件
 */
import React, { memo } from 'react';
import { View, Textarea } from '@tarojs/components';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const Index = ({
  value,
  rows,
  placeholder,
  disabled,
  maxLength,
  showLimit,
  cursorSpacing,
  onChange,
  onFocus,
  onBlur,
}) => {
  return (
    <View className={styles.container}>
      <View className={styles['container-inner']}>
        <Textarea
          className={value ? styles['textarea-editing'] : styles.textarea}
          placeholderClass={styles['textarea-placeholder']}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          autoHeight={true}
          showConfirmBar={false}
          onFocus={onFocus}
          onBlur={onBlur}
          cursorSpacing={200}
          onInput={e => onChange(e.target.value, maxLength)}
        />
      </View>
    </View>
  );
};

Index.propTypes = {
  value: PropTypes.string,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  showLimit: PropTypes.bool,
  cursorSpacing: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

// 设置props默认类型
Index.defaultProps = {
  value: '',
  rows: 4,
  placeholder: '请填写您的发布内容...',
  disabled: false,
  maxLength: 5000,
  showLimit: false,
  cursorSpacing: 0,
  onChange: () => { },
  onFocus: () => { },
  onBlur: () => { },
};

export default memo(Index);
