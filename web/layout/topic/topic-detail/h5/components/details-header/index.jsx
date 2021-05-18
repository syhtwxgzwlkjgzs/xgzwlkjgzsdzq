import React from 'react';
import { Icon } from '@discuzq/design';
import { noop } from '@components/thread/utils';
import styles from './index.module.scss';
import { withRouter } from 'next/router';


/**
 * 用户组件
 * @prop {string} title 话题标题
 * @prop {number} viewNum 热度
 * @prop {number} contentNum 内容数
 * @prop {function} onClick 全部话题点击事件
 */
const TopicHeader = ({ title, viewNum = 0, contentNum = 0, onShare = noop, router }) => {
  const goList = () => {
    router.push('/search/result-topic');
  }
  return (
    <div className={styles.container} style={{ backgroundImage: `url('/dzq-img/topic-header.png')` }}>
      <div className={styles.title}>{title && `#${title}#`}</div>
      <ul className={styles.siteInfo}>
          <li>
            <span className={styles.text}>热度</span>
            <span className={styles.content}>{viewNum}</span>
          </li>
          <li className={styles.hr}></li>
          <li>
            <span className={styles.text}>内容数</span>
            <span className={styles.content}>{contentNum}</span>
          </li>
          <li className={styles.hr}></li>
          <li onClick={onShare}>
            <Icon className={styles.shareIcon}name="ShareAltOutlined" size={14} />
            <span className={styles.text}>分享</span>
          </li>
          <li className={styles.hr}></li>
          <li onClick={goList}>
            <span className={styles.text}>全部话题</span>
            <Icon className={styles.rightIcon} name="RightOutlined" size={12} />
          </li>
        </ul>
    </div>
  );
};

export default withRouter(React.memo(TopicHeader));
