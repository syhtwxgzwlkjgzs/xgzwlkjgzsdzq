import React from 'react';
import { Input } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 搜索输入框
 * @prop {function} onSearch 搜索事件
 *    @param {string} value 搜索字符串
 * @prop {function} onCancel 取消事件
 */

const SearchInput = ({ onSearch, onCancel  }) => {
  const [value, setValue] = React.useState('');

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        {/* <Icon name="SearchOutlined" size={16} /> 使用报错*/}
        <div className={styles.icon}></div>
        <Input
          clearable={true}
          value={value}
          onEnter={e => onSearch(e.target.value)}
          onChange={e => setValue(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.cancel} onClick={onCancel}>
         取消
      </div>
    </div>
  );
};

export default SearchInput;
