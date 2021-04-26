import React from 'react';
import { Icon } from '@discuzq/design';
import { noop } from '@components/thread/utils';
import styles from './index.module.scss';
import Link from 'next/link';

/**
 * 用户组件
 * @prop {string} title 话题标题
 * @prop {number} viewNum 热度
 * @prop {number} contentNum 内容数
 * @prop {function} onClick 全部话题点击事件
 */
const TopicHeader = ({ title, viewNum = 0, contentNum = 0, onClick = noop}) => {
  return (
    <div className={styles.container} >
      <div className={styles.title}>{title && `#${title}#`}</div>
      <div className={styles.allTopic}>
        <Link href="/topic">全部话题 &gt;</Link>
      </div>
      <ul className={styles.siteInfo}>
          <li>
            <span className={styles.text}>热度</span>
            <span className={styles.content}>{viewNum}</span>
          </li>
          <li>
            <span className={styles.text}>内容数</span>
            <span className={styles.content}>{contentNum}</span>
          </li>
          <li>
            <Icon className={styles.shareIcon} color="#8590a6" name="ShareAltOutlined"/>
            <span className={styles.text}>分享</span>
          </li>
        </ul>
    </div>
  );
};

export default React.memo(TopicHeader);
