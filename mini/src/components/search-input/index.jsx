import React from 'react';
import { Input, Icon } from '@discuzq/design';
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss';

/**
 * 搜索输入框
 * @prop {function} onSearch 搜索事件
 * @param {string} value 搜索字符串
 * @prop {function} onCancel 取消事件
 * @prop {string} defaultValue 默认值
 * @prop {string} isShowCancel 是否显示取消按钮
 */

const SearchInput = ({ onSearch, onCancel, defaultValue = '', isShowCancel = true, isShowBottom = true }) => {
  const [value, setValue] = React.useState(defaultValue);
  const [isShow, setIsShow] = React.useState(false);
  const inputChange = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      setIsShow(true)
    }
  }
  const clearInput = () => {
    setValue('');
    setIsShow(false)
  }
  const inputClick = () => {
    onSearch(value)
  }
  return (
    <View className={`${styles.container} ${!isShowBottom && styles.hiddenBottom}`}>
      <View className={styles.inputWrapper}>
        <Icon className={styles.inputWrapperIcon} name="SearchOutlined" size={16} />
        <Input
          value={value}
          placeholder='请输入想要搜索的内容...'
          onEnter={inputClick}
          onChange={e => inputChange(e)}
          className={styles.input}
        />
        {
          isShow && (
            <Icon className={styles.deleteIcon} name="WrongOutlined" size={16} onClick={clearInput}/>
          )
        }
      </View>
      {
        isShowCancel && (
          <View className={styles.cancel} onClick={inputClick}>
            确认
          </View>
        )
      }
    </View>
  );
};

export default SearchInput;
