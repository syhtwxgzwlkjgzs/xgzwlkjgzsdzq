import React, { useCallback, useMemo } from 'react';
import PostContent from '@components/thread/post-content';
import replaceSearchResultContent from '@common/utils/replace-search-result-content';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import { noop } from '@components/thread/utils';
import styles from './index.module.scss';
import {RichText} from '@discuzq/design';

export const TopicItem = ({ data, onClick = noop }) => {
    const click = useCallback((e) => {
      if (e.target.localName === 'a') {
        return
      }
      onClick && onClick(data);
    }, [data, onClick]);
  
    const { threads = [] } = data
  
    const filterContent = useMemo(() => {
      const content = threads[0]?.content?.text || '暂无内容'
      let newContent = replaceSearchResultContent(content);
      newContent = s9e.parse(newContent);
      newContent = xss(newContent);
  
      return newContent;
    }, [threads]);

  // TODO 表情两行显示有问题
    return (
      <div className={styles.container} onClick={click}>
        <div className={styles.title}>{`#${data.content}#` || '暂无内容'}</div>
        <div className={styles.content}>
          <RichText onClick={click} className={styles.richText} content={filterContent} />
        </div>
        <div className={styles.tags}>
          <div className={styles.tag}>热度 {data.viewCount || 0}</div>
          <span className={styles.dot}>·</span>
          <div className={styles.tag}>内容 {data.threadCount || 0}</div>
        </div>
      </div>
    );
};

export default React.memo(TopicItem);
