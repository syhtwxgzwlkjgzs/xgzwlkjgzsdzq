import React, { useCallback } from 'react';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';
import { handleAttachmentData, noop } from '@components/thread/utils';
/**
 * 潮流话题
 * @prop {string[]} data 话题数据
 * @prop {function} onItemClick 话题点击事件
 */
const TrendingTopics = ({ data, onItemClick }) => (
    <div className={styles.list}>
    {data?.map((item, index, arr) => (
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
  const {
    text = '',
    imageData = []
  } = handleAttachmentData(data?.threads[0]?.content);
  return (
    <div className={styles.item}>
      <div className={styles.imgBox}>
        { imageData.length > 0 && imageData[0].url ? (
            <img className={styles.img} src={data.img}/>
          ) : `${data.content[0]}`
        }
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{data.content ? `#${data.content}#`: '暂无标题'}</div>
        <div className={styles.num}>
          <div className={styles.numItem}>
            <Icon name="EyeOutlined" size={15} color="#8490A8" className={styles.numIcon}/>
            {data.viewCount}
          </div>
          <div className={styles.numItem}>
            <Icon name="MessageOutlined" size={15} color="#8490A8" className={styles.numIcon}/>
            {data.threadCount}
          </div>
        </div>
        <div className={styles.text}>{text || '暂无内容'}</div>
      </div>
    </div>
  );
};

export default React.memo(TrendingTopics);
