import React from 'react';
import { Input, Icon } from '@discuzq/design';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 搜索输入框
 * @prop {function} onSearch 搜索事件
 * @param {string} value 搜索字符串
 * @prop {function} onCancel 取消事件
 * @prop {string} defaultValue 默认值
 * @prop {string} isShowCancel 是否显示取消按钮
 */

const SearchInput = ({ onSearch, onCancel, defaultValue = '', isShowCancel = true }) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <View className={styles.container}>
      <View className={styles.inputWrapper}>
        <Icon name="SearchOutlined" size={16} />
        <Input
          clearable={true}
          value={value}
          onEnter={e => onSearch(e.target.value)}
          onChange={e => setValue(e.target.value)}
          className={styles.input}
        />
      </View>
      {
        isShowCancel && (
          <View className={styles.cancel} onClick={() => {onCancel}}>
            取消
          </View>
        )
      }
    </View>
  );
};

export default SearchInput;
