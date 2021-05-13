import React, { useCallback } from 'react';
import ImageDisplay from '@components/thread/image-display';
import PostContent from '@components/thread/post-content';
import { handleAttachmentData, noop } from '@components/thread/utils';
import styles from './index.module.scss';

/**
 * 话题组件
 * @prop {object} data 话题数据
 * @prop {function} onClick 话题点击事件
 */
const TopicItem = ({ data, onClick }) => {
  const click = useCallback(() => {
    onClick && onClick(data);
  }, [data, onClick]);
  const {
    text = '',
    imageData = []
  } = handleAttachmentData(data?.threads[0]?.content);

  return (
    <div className={styles.item} onClick={click}>
      <div className={styles.title}>{data.content && `#${data.content}#`}</div>
      <PostContent content={text} className={styles.content} />
      {imageData?.length && <ImageDisplay imgData={imageData}/>}
      <div className={styles.footer}>
        <div className={styles.numBox}>
          <span>热度</span>
          {data.viewCount || 0}
        </div>
        <div className={styles.numBox}>
          <span>内容</span>
          {data.threadCount || 0}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TopicItem);
