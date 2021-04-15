import React from 'react';
import { Icon } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 栏目头部
 * @prop {string} icon 图标url
 * @prop {string} title 标题
 * @prop {function} onShowMore 查看更多事件
 */
const TrendingTopics = ({ icon, title, onShowMore }) => (
  <div className={styles.container}>
    <div className={styles.left}>
      <img src={icon} />
      <div className={styles.title}>{title}</div>
    </div>
    <div className={styles.right}>
      <div onClick={onShowMore} className={styles.more}>
        更多
      </div>
      <Icon name="RightOutlined" size={10} />
    </div>
  </div>
);

export default React.memo(TrendingTopics);
