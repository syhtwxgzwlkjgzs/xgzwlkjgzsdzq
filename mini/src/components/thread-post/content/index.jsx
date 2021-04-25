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
 * @prop {function} onFocus onChange事件，输出当前文本框内容
 */
import React, { memo } from 'react';
import { View } from '@tarojs/components';
import { Input } from '@discuzq/design';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const TextArea = ({
  value,
  rows,
  placeholder,
  disabled,
  maxLength,
  showLimit,
  cursorSpacing,
  onChange,
  onFocus,
}) => {
  return (
    <View className={styles.container}>
      <View className={styles['container-inner']}>
        <Input.Textarea
          className={`${styles.content}`}
          value={value}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          showLimit={showLimit}
          cursorSpacing={cursorSpacing}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
        />
        {!showLimit &&
          <View className={styles['content-length']}>
            还能输入{parseInt(maxLength - value.length)}个字
          </View>
        }
      </View>
    </View>
  );
};

TextArea.propTypes = {
  value: PropTypes.string,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  showLimit: PropTypes.bool,
  cursorSpacing: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};

// 设置props默认类型
TextArea.defaultProps = {
  value: '',
  rows: 8,
  placeholder: '请填写您的发布内容...',
  disabled: false,
  maxLength: 5000,
  showLimit: false,
  cursorSpacing: 0,
  onChange: () => { },
  onFocus: () => { },
};

export default memo(TextArea);
