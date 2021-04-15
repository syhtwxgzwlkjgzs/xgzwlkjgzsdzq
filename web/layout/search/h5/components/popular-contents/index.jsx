import React from 'react';

import ThreadContent from '@common/components/thread';

import styles from './index.module.scss';

/**
 * 热门内容
 * @props {object[]} data 帖子数据
 */
const PopularContents = ({ data }) => (
    <div className={styles.list}>
      {data.map((item, index) => (
        <ThreadContent key={index} />
      ))}
    </div>
);

export default React.memo(PopularContents);
