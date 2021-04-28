import React, { useCallback, useState } from 'react';
import { Dropdown, Icon } from '@discuzq/design';
import { noop } from '@components/thread/utils';

import styles from './index.module.scss';

/**
 * 话题头部组件
 */
const TopicHeader = ({ onClick = noop }) => {
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
        onChange={onClick}
        className={styles.sortDropdown}
      >
        <Icon name="SortOutlined" size={18} color='#2469f6'/>
        排序
      </Dropdown>
    </div>
  );
};

export default React.memo(TopicHeader);
