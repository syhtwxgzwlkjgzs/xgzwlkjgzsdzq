import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Router from '@common/utils/web-router';

/**
 * 帖子头部
 * @prop {string} bgColor 背景颜色
 * @prop {boolean} hideInfo 隐藏站点信息
 */

 @inject('site')
 @observer
class HomeHeader extends React.Component {
   constructor(props) {
     super(props);
   }

  logoImg = '/dzq-img/admin-logo-x2.png';

  getBgHeaderStyle(bgHeadFullImg, bgColor) {
    if (bgHeadFullImg) {
      return { backgroundImage: `url(${bgHeadFullImg})` };
    }
    return (bgColor
      ? { background: bgColor }
      : { background: '#2469f6' }
    );
  }

  render() {
    const { bgColor, hideInfo = false, site } = this.props;
    const { siteBackgroundImage, siteLogo } = site?.webConfig?.setSite || {};
    const { countUsers, countThreads } = site?.webConfig?.other;

    return (
      <div className={styles.container} style={this.getBgHeaderStyle(siteBackgroundImage, bgColor)}>
        {hideInfo && <div className={styles.topBar}>
          <div></div>
          <div>
            <Icon onClick={() => {
              Router.redirect('/');
            }} name="HomeOutlined" color="#fff" size={20} />
          </div>
        </div>}
        <div className={styles.logoBox}>
          <img
              className={styles.logo}
              mode="aspectFit"
              src={siteLogo ? siteLogo : this.logoImg}
          />
        </div>
        {!hideInfo && <ul className={styles.siteInfo}>
          <li>
            <span className={styles.text}>成员</span>
            <span className={styles.content}>{countUsers}</span>
          </li>
          <li>
            <span className={styles.text}>内容</span>
            <span className={styles.content}>{countThreads}</span>
          </li>
          <li>
            <Icon className={styles.shareIcon} color="#fff" name="ShareAltOutlined"/>
            <span className={styles.text}>分享</span>
          </li>
        </ul>}
      </div>
    );
  }
 }

export default HomeHeader;
