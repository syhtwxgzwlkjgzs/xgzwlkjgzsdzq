import React, { useCallback } from 'react';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';

/**
 * 潮流话题
 * @prop {string[]} data 话题数据
 * @prop {function} onItemClick 话题点击事件
 */
const TrendingTopics = ({ data, onItemClick }) => (
    <div className={styles.list}>
    {data.map((item, index, arr) => (
      <Topic key={index} index={index} data={item} onClick={onItemClick} footer={arr.length - index < 3} />
    ))}
  </div>
);


/**
 * 话题组件
 * @prop {title:string, content:string, hotCount:number, contentCount:number} data 话题数据
 * @prop {function} onClick 话题点击事件
 * @prop {number} index
 */
const Topic = ({ data, onClick, index, footer }) => {
  const click = useCallback(() => {
    onClick && onClick(data);
  }, [data, onClick]);

  return (
    <div className={styles.item}>
      <img className={styles.img} src={data.img}/>
      <div className={styles.content}>
        <div className={styles.title}>{data.title ? `#${data.title}#`: '暂无标题'}</div>
        <div className={styles.num}>
          <div className={styles.numItem}>
            <Icon name="EyeOutlined" size={15} color="#8490A8" className={styles.numIcon}/>
            {data.view_count}
          </div>
          <div className={styles.numItem}>
            <Icon name="MessageOutlined" size={15} color="#8490A8" className={styles.numIcon}/>
            {data.thread_count}
          </div>
        </div>
        <div className={styles.text}>{data.content}</div>
      </div>
    </div>
  );
};

export default React.memo(TrendingTopics);
