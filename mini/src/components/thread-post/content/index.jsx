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
import { View, Textarea } from '@tarojs/components';
import browser from '@common/utils/browser';
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
  const [isAndroid, setIsAndroid] = useState(true);
  const [height, setHeight] = useState(78); // IOS textarea展示高度
  const [realHeight, setRealHeight] = useState(78); // 记录IOS textarea内容真实高度

  // 兼容ios，监听换行更新高度
  const onLineChange = (e) => {
    if (bottomHeight === 0) return;
    const { height } = e.detail;
    // 记录content真实高度
    setRealHeight(height > 78 ? height : 78);

    // 编辑时换行实时更新高度
    if ((bottomHeight > 0 || showEmoji)) {
      if (height < 78) {
        setHeight(78);
      } else if (height > 260) {
        setHeight(260);
      } else {
        setHeight(height + 30 > 260 ? 260 : height + 30); // 为避免抖动，补偿30px展示高度
      }
    };
  }

  useEffect(() => {
    if (isAndroid) return;

    if (bottomHeight > 0 || showEmoji) {
      setHeight(realHeight < 260 ? realHeight : 260); // ios输入文本、表情时，设置可视区高度
    } else {
      setHeight(realHeight); // 键盘隐藏且小表情隐藏时，展开内容可视区
    }
  }, [bottomHeight, showEmoji])

  useEffect(() => {
    browser.env('ios') && setIsAndroid(false);
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
          style={`height:${height}px`}
          showConfirmBar={false}
          onFocus={onFocus}
          onBlur={onBlur}
          cursorSpacing={200}
          onInput={e => onChange(e.target.value, maxLength)}
          // 键盘弹起时，不自动上推页面。此属性解决键盘弹起页面上推导致工具栏以及header显示异常
          adjustPosition={false}
          onLineChange={onLineChange}
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
