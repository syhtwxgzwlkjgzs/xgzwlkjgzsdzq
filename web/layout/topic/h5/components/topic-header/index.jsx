import React, { useCallback, useState } from 'react';
import { Dropdown, Icon } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 话题头部组件
 */
const TopicHeader = () => {
  const [topicSort, setTopicSort] = useState('recommended');
  const onClickFirst = (key) => {
    if (key === 1) {
      setTopicSort('-viewCount');
    } else {
      setTopicSort('-threadCount');
    }
  };
  const menu = () => {
    return (
      <Dropdown.Menu>
        <Dropdown.Item id="1">热度</Dropdown.Item>
        <Dropdown.Item id="2">内容数</Dropdown.Item>
      </Dropdown.Menu>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.title}>话题列表</div>
      <Dropdown
        style={{ display: 'inline-block' }}
        menu={menu()}
        placement="right"
        arrow={false}
        trigger="click"
        onChange={() => onClickFirst(key)}
        className={styles.sortDropdown}
      >
        <Icon name="SortOutlined" size={18} color='#2469f6'/>
        排序
      </Dropdown>
    </div>
  );
};

export default React.memo(TopicHeader);
