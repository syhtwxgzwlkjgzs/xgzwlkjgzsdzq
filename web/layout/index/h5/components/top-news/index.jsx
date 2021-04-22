import React, { useMemo } from 'react';

import styles from './index.module.scss';

/**
 * 置顶消息
 * @prop {{prefix:string, title:string}[]} data
 * @prop {number} itemMargin 置顶中的margin值
 * @prop {boolean} isShowBorder 是否显示底部框
 */

const TopNews = ({ data = [], itemMargin = 20, isShowBorder = true }) => {
  const styleTopNews = useMemo(() => {
    return {
      margin: `0 ${itemMargin}px`,
      borderBottom: (isShowBorder ? '1px solid #eee' : 'none')
    }
  }, [itemMargin, isShowBorder]);
  return (
    <div className={styles.list}>
      {data.map((item, index) => (
        <div key={index} className={styles.item} style={styleTopNews}>
          <div className={styles.prefix}>{item.prefix || '置顶'}</div>
          <div className={styles.title}>{item.title}</div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TopNews);
