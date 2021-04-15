import React from 'react';

import ThreadContent from '@common/components/thread';

import styles from './index.module.scss';
import pageStyles from '../../index.module.scss';

/**
 * 热门内容
 * @props {object[]} data 帖子数据
 */
const PopularContents = ({ data }) => (
  <div className={styles.list}>
    {data.map((item, index, arr) => (
      <div key={index}>
        <div>
          <ThreadContent />
        </div>
        {index !== arr.length - 1 && <div className={pageStyles.hr} />}
      </div>
    ))}
  </div>
);

export default React.memo(PopularContents);
