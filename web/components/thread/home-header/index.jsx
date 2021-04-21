import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';

/**
 * 帖子头部
 * @prop {string} bgHeadFullImg 背景图片
 * @prop {string} bgColor 背景颜色
 * @prop {string} headImg 站点logo
 * @prop {string | number} userNum 成员数
 * @prop {string | number} themeNum 内容数
 */

const Index = ({ bgHeadFullImg, bgColor, headImg, userNum = 0, themeNum = 0 }) => {
  const logoImg = '/admin-logo-x2.png';

  const bgHeader = useMemo(() => {
    if (bgHeadFullImg) {
      return { backgroundImage: `url(${bgHeadFullImg})` };
    }
    return (bgColor
      ? { background: bgColor }
      : { background: '#2469f6' }
    );
  }, [bgColor, bgHeadFullImg]);

  return (
    <div className={styles.container} style={bgHeader}>
      <div className={styles.logoBox}>
        <img
            className={styles.logo}
            mode="aspectFit"
            src={headImg ? headImg : logoImg}
        />
      </div>
      <ul className={styles.siteInfo}>
        <li>
          <span className={styles.text}>成员</span>
          <span className={styles.content}>{userNum}</span>
        </li>
        <li>
          <span className={styles.text}>内容</span>
          <span className={styles.content}>{themeNum}</span>
        </li>
        <li>
          <Icon className={styles.shareIcon} color="#fff" name="ShareAltOutlined"/>
          <span className={styles.text}>分享</span>
        </li>
      </ul>
    </div>
  );
};

export default React.memo(Index);
