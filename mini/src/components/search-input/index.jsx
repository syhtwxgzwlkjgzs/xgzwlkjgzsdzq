import React from 'react';
import Icon from '@discuzq/design/dist/components/icon/index';
import { View, Input } from '@tarojs/components';
import { debounce } from '@common/utils/throttle-debounce.js';

import styles from './index.module.scss';

/**
 * 搜索输入框
 * @prop {function} onSearch 搜索事件
 * @param {string} value 搜索字符串
 * @prop {function} onCancel 取消事件
 * @prop {string} defaultValue 默认值
 * @prop {string} isShowCancel 是否显示取消按钮
 */

const SearchInput = ({
  onSearch,
  onCancel,
  defaultValue = '',
  isShowCancel = true,
  isShowBottom = true,
  searchWhileTyping = false,
  searchWhileTypingStartsAt = 0,
}) => {
  // const [value, setValue] = React.useState(defaultValue);
  const [isShow, setIsShow] = React.useState(false);
  const [timeoutID, setTimeoutID] = React.useState(null);
  const inputChange = (e) => {
    const val = e.target.value;
    // setValue(val);
    if (val.length > 0) {
      if(!isShow) setIsShow(true)
    }
    if(searchWhileTyping && val.length >= searchWhileTypingStartsAt) {
      if(timeoutID !== null) { // 做一个防抖Debounce
        clearTimeout(timeoutID);
        setTimeoutID(null);
      }
      setTimeoutID(setTimeout(() => {
        onSearch(val);
      }, searchWhileTyping ? 1000 : 0));
    }
  }
  const clearInput = () => {
    setIsShow(false)
  }
  const inputClick = (e) => {
    // TODO: 加节流
    const val = e.target.value || "";
    onSearch(val)
  }
  return (
    <View className={`${styles.container} ${!isShowBottom && styles.hiddenBottom}`}>
      <View className={styles.inputWrapper}>
        <Icon className={styles.inputWrapperIcon} name="SearchOutlined" size={16} />
        <Input
          // value={value}
          placeholder='请输入想要搜索的内容...'
          onEnter={e => inputClick(e)}
          onInput={e => inputChange(e)}
          className={styles.input}
          confirmType='search'
          onConfirm={e => inputClick(e)}
          placeholderClass={styles.placeholder}
        />
        {
          isShow && (
              <Icon className={styles.deleteIcon} name="WrongOutlined" size={16} onClick={clearInput}/>
          )
        }
      </View>
      {
        isShowCancel && (
          <View className={styles.cancel} onClick={onCancel}>
            取消
          </View>
        )
      }
    </View>
  );
};

export default SearchInput;
