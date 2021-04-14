import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import SectionTitle from '../section-title';

import styles from './index.module.scss';

/**
 * 热门内容
 * @props {object[]} data 帖子数据
 */
const PopularContents = ({ data }) => {
  const router = useRouter();

  const onShowMore = useCallback(() => {
    router.push('/search-result-post');
  }, [router]);
  return (
    <>
      <SectionTitle title="热门内容" onShowMore={onShowMore} />
      <div className={styles.list}>
        {data.map((item, index) => (
          <div key={index} />
        ))}
      </div>
    </>
  );
};

export default React.memo(PopularContents);
