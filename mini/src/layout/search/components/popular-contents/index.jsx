import React from 'react';

// import ThreadContent from '@components/thread';

import styles from './index.module.scss';

/**
 * 热门内容
 * @prop {object[]} data 帖子数据
 */
const PopularContents = ({ data, onItemClick }) => (
  <div className={styles.list}>
    {/* {
      data.map((item, index) => <ThreadContent data={item} key={index} />)
    } */}
    热门内容
    {/* {data.map((item, index, arr) => (
      <Post key={index} data={item} onClick={onItemClick} divider={index !== arr.length - 1} />
    ))} */}
  </div>
);

export default React.memo(PopularContents);
