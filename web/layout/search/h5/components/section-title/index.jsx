import React from 'react';
import { Icon } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 栏目头部
 * @prop {string} icon 图标url
 * @prop {string} title 标题
 * @prop {function} onShowMore 查看更多事件
 * @prop {boolean} isShowMore 是否显示更多
 */
const TrendingTopics = ({ icon = { type: '' }, title, onShowMore, isShowMore = true }) => (
  <div className={styles.container}>
    <div className={styles.left}>
      <div className={styles.leftBox}>
        <Icon className={styles[`icon${icon.type}`]} name={icon.name} size={16} />
      </div>
      <div className={styles.title}>{title}</div>
    </div>
    {
      isShowMore ?
      <div className={styles.right}>
        <div onClick={onShowMore} className={styles.more}>
          更多
        </div>
        <Icon name="RightOutlined" size={10} />
      </div>
      : ''
    }
  </div>
);

export default React.memo(TrendingTopics);
