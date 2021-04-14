import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import SectionTitle from '../section-title';

import styles from './index.module.scss';

/**
 * 潮流话题
 * @props {string[]} data 话题数据
 */
const TrendingTopics = ({ data }) => {
  const router = useRouter();

  const onShowMore = useCallback(() => {
    // router.push('/')
  }, [router]);
  return (
    <>
      <SectionTitle title="潮流话题" onShowMore={onShowMore} />
      <div className={styles.list}>
        {data.map((text, index, arr) => (
            <div key={index} className={`${styles.item} ${arr.length - index < 3 ? styles.footerItem : ''}`}>
              <span className={`${styles.index} ${styles[`itemIndex${index + 1}`]}`}>{index + 1}</span>
              <span className={styles.text}>{text}</span>
            </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(TrendingTopics);
