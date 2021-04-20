import React from 'react';
import { Input, Icon } from '@discuzq/design';

import styles from './index.module.scss';

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
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Icon name="SearchOutlined" size={16} />
        <Input
          clearable={true}
          value={value}
          onEnter={e => onSearch(e.target.value)}
          onChange={e => setValue(e.target.value)}
          className={styles.input}
        />
      </div>
      {
        isShowCancel && (
          <div className={styles.cancel} onClick={onCancel}>
            取消
          </div>
        )
      }
    </div>
  );
};

export default SearchInput;
