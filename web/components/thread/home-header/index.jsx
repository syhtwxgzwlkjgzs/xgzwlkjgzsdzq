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
  const logoImg = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201408%2F30%2F20140830180834_XuWYJ.png&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620908425&t=673ddda42973b103faf179fc02818b41';

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
                lazy-load
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
