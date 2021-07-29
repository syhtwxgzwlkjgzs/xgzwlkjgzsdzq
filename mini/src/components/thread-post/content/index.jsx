/**
 * 发帖页内容
 * @prop {string} value 绑定值
 * @prop {string} placeholder 站位内容
 * @prop {string} disabled 是否禁用
 * @prop {string} maxLength 最大长度
 * @prop {function} onChange onChange事件，输出当前文本框内容
 * @prop {function} onFocus 聚焦事件
 * @prop {function} onBlur 失焦事件
 */
import React, { useState, useEffect, memo, forwardRef } from 'react';
import Taro from "@tarojs/taro";
import { View, Textarea } from '@tarojs/components';
import { debounce } from '@common/utils/throttle-debounce.js';
import classNames from 'classnames';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

/**
 * 发帖文本输入
 * android:使用 autoHeight 自增高 ，style.height失效。
 * ios: autoHeight存在兼容性问题，通过JS控制 style.height进行高度变化
 * */
const Index = forwardRef(({
  value,
  placeholder,
  disabled,
  showEmoji,
  bottomHeight,
  maxLength,
  onChange,
  onFocus,
  onBlur,
}, ref) => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [height, setHeight] = useState(78); // IOS textarea输入时的展示高度
  const [realHeight, setRealHeight] = useState(78); // 记录IOS textarea展开时的真实高度

  // 兼容ios，监听换行更新高度
  const onLineChange = (e) => {
    if ((bottomHeight > 0 || showEmoji)) {
      const newHeight = e.detail.height + 30; // 为避免抖动，补偿30px展示高度
      setRealHeight(e.detail.height > 78 ? newHeight : 78);
      if (height < 260 && height < newHeight) {
        setHeight(newHeight > 260 ? 260 : newHeight);
      }
    };
  }

  useEffect(() => {
    Taro.getSystemInfo({
      success: (res) => {
        res?.platform !== 'ios' && setIsAndroid(true);
      }
    })
  }, [])

  if (isAndroid) {
    return (
      <View className={styles.container} onClick={e => e.stopPropagation()}>
        <View className={styles['container-inner']}>
          <Textarea
            ref={ref}
            className={classNames(styles.textarea, !!value && styles['textarea-editing'], {
              [styles['textarea-max-height']]: bottomHeight > 0 || showEmoji,
            })}
            placeholderClass={styles['textarea-placeholder']}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            maxlength={maxLength}
            autoHeight={true}
            showConfirmBar={false}
            onFocus={onFocus}
            onBlur={onBlur}
            cursorSpacing={200}
            onInput={e => onChange(e.target.value, maxLength)}
            // 键盘弹起时，不自动上推页面。此属性解决键盘弹起页面上推导致工具栏以及header显示异常
            adjustPosition={false}
          />
        </View>
      </View>
    )
  }

  return (
    <View className={styles.container} onClick={e => e.stopPropagation()}>
      <View className={styles['container-inner']}>
        <Textarea
          ref={ref}
          className={classNames(styles.textarea, !!value && styles['textarea-editing'])}
          placeholderClass={styles['textarea-placeholder']}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          maxlength={maxLength}
          style={`height:${(bottomHeight > 0 || showEmoji) ? height : realHeight}px`}
          showConfirmBar={false}
          onFocus={onFocus}
          onBlur={onBlur}
          cursorSpacing={200}
          onInput={e => onChange(e.target.value, maxLength)}
          // 键盘弹起时，不自动上推页面。此属性解决键盘弹起页面上推导致工具栏以及header显示异常
          adjustPosition={false}
          onLineChange={debounce(onLineChange, 200)}
        />
      </View>
    </View>
  );
});

Index.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

// 设置props默认类型
Index.defaultProps = {
  value: '',
  placeholder: '请填写您的发布内容...',
  disabled: false,
  maxLength: 5000,
  onChange: () => { },
  onFocus: () => { },
  onBlur: () => { },
};

export default memo(Index);
