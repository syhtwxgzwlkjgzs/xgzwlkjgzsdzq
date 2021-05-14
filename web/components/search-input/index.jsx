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
  return (
    <div className={`${styles.container} ${!isShowBottom && styles.hiddenBottom}`}>
      <div className={styles.inputWrapper}>
        <Icon className={styles.inputWrapperIcon} name="SearchOutlined" size={16} />
        <Input
          value={value}
          placeholder='全局设置的全部功能'
          onEnter={e => onSearch(e.target.value)}
          onChange={e => inputChange(e)}
          className={styles.input}
        />
        {
          isShow && (
            <Icon className={styles.deleteIcon} name="WrongOutlined" size={16} onClick={clearInput}/>
          )
        }
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
