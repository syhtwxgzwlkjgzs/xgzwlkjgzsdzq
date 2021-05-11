import React from 'react';
import styles from './index.module.scss';
import { Icon, Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import SharePopup from '../thread/share-popup';
import isWeiXin from '@common/utils/is-weixin';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
// import goToLoginPage from '@common/utils/go-to-login-page';

/**
 * 帖子头部
 * @prop {string} bgColor 背景颜色
 * @prop {boolean} hideInfo 隐藏站点信息
 */

 @inject('site')
 @inject('user')
 @observer
class HomeHeader extends React.Component {
  state = {
    visible: false,
  }

  logoImg = '/dzq-img/admin-logo-x2.png';

  getBgHeaderStyle(bgColor) {
    const { site } = this.props;
    const siteData = site.webConfig;

    if (siteData && siteData.setSite && siteData.setSite.bgHeadFullImg) {
      return { backgroundImage: `url(${siteData.bgHeadFullImg})` };
    }
    return (bgColor
      ? { background: bgColor }
      : { background: '#2469f6' }
    );
  }

  getLogo() {
    const { site } = this.props;
    const siteData = site.webConfig;
    if (siteData && siteData.setSite && siteData.setSite.siteLogo) {
      return siteData.siteLogo;
    }
    return this.logoImg;
  }

  getSiteInfo() {
    const { site } = this.props;
    const siteData = site.webConfig;
    if (siteData && siteData.other) {
      return {
        countUsers: siteData.other.countUsers,
        countThreads: siteData.other.countThreads,
      };
    }
    return {
      countUsers: 0,
      countThreads: 0,
    };
  }

  onShare = () => {
    const { user } = this.props;
    if (!user.isLogin()) {
      // goToLoginPage();
      return;
    }
    // 判断是否在微信浏览器
    if (isWeiXin) {
      this.setState({ visible: true });
    } else {
      const title = document?.title || '';
      h5Share(title);
      Toast.info({ content: '分享链接已复制成功' });
    }
  }

  onClose = () => {
    this.setState({ visible: false });
  }

  render() {
    const { bgColor, hideInfo = false, style = {}, digest = null } = this.props;
    const { visible } = this.state;
    const { countUsers, countThreads } = this.getSiteInfo();

    return (
      <div className={styles.container} style={{style, ...this.getBgHeaderStyle(bgColor)}}>
        {hideInfo && <div className={styles.topBar}>
          <div></div>
          <div>
            <Icon onClick={() => {
              Router.redirect({url:'/'});
            }} name="HomeOutlined" color="#fff" size={20} />
          </div>
        </div>}
        <div className={styles.logoBox}>
          <img
              className={styles.logo}
              mode="aspectFit"
              src={this.getLogo()}
          />
        </div>
        {digest && <div className={styles.digest}>
            <div className={styles.left}>站长 {digest.admin}</div>
            <div className={styles.right}>已创建 {digest.day}天</div>
        </div>}
        {!hideInfo && <ul className={styles.siteInfo}>
          <li className={styles.item}>
            <span className={styles.text}>成员</span>
            <span className={styles.content}>{countUsers}</span>
          </li>
          <li className={styles.item}>
            <span className={styles.text}>内容</span>
            <span className={styles.content}>{countThreads}</span>
          </li>
          <li className={styles.item} onClick={this.onShare}>
            <Icon className={styles.shareIcon} color="#fff" name="ShareAltOutlined"/>
            <span className={styles.shareText}>分享</span>
          </li>
        </ul>}
        {isWeiXin && <SharePopup visible={visible} onClose={this.onClose} />}
      </div>
    );
  }
 }

export default HomeHeader;
