import React from 'react';
import styles from './index.module.scss';
import { Icon, Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import SharePopup from '../thread/share-popup';
import isWeiXin from '@common/utils/is-weixin';
import { get } from '@common/utils/get';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import goToLoginPage from '@common/utils/go-to-login-page';

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
    height: 180,
  }

  domRef = React.createRef(null)

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
    const { webConfig } = site;
    const siteInfo = {
      countUsers: 0,
      countThreads: 0,
      siteAuthor: '',
      createDays: 0
    };
    if (webConfig && webConfig.other) {
      siteInfo.countUsers = webConfig.other.countUsers;
      siteInfo.countThreads = webConfig.other.countThreads;
    };
    const siteAuthor = get(webConfig, 'setSite.siteAuthor.username', '');
    const siteInstall = get(webConfig, 'setSite.siteInstall', '');
    const  startDate = Date.parse(siteInstall);
    const  endDate = Date.parse(new Date());
    const days = parseInt(Math.abs(startDate  -  endDate) / 1000 / 60 / 60 / 24);

    siteInfo.siteAuthor = siteAuthor;
    siteInfo.createDays = days;

    return siteInfo;
  }

  onShare = () => {
    const { user } = this.props;
    if (!user.isLogin()) {
      goToLoginPage({ url: '/user/login' });
      return;
    }

    // 判断是否在微信浏览器
    if (isWeiXin()) {
      this.setState({ visible: true });
    } else {
      const title = document?.title || '';
      h5Share(title);
      Toast.info({ content: '复制链接成功' });
    }
  }

  onClose = () => {
    this.setState({ visible: false });
  }

  componentDidMount() {
    if (this.domRef.current) {
      this.setState({ height: this.domRef.current.clientHeight });
    }
  }

  render() {
    const { bgColor, hideInfo = false, style = {}, digest = null, mode = '' } = this.props;
    const { visible } = this.state;
    const { countUsers, countThreads, siteAuthor, createDays } = this.getSiteInfo();

    return (
      <div ref={this.domRef}
        className={`${styles.container} ${mode ? styles[`container_mode_${mode}`] : ''}`}
        style={{ ...style, ...this.getBgHeaderStyle(bgColor) }}
      >
        {hideInfo && mode !== 'join' && <div className={styles.topBar}>
          {
            mode === 'login'
              ? <div onClick={() => Router.back()} className={styles.left}>
                  <Icon name="LeftOutlined" />返回
                </div>
              : <></>
          }
          <div>
            <Icon onClick={() => {
              Router.redirect({ url: '/' });
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
        {
          mode === 'join' && <ul className={`${styles.siteInfo} ${styles.joinInfo}`}>
            <li className={styles.item}>
              <span className={styles.text}>站长</span>
              <span className={styles.content}>{siteAuthor}</span>
            </li>
            <li className={styles.item}>
              <span className={styles.text}>已创建</span>
              <span className={styles.content}>{createDays}天</span>
            </li>
          </ul>
        }
        {isWeiXin && <SharePopup visible={visible} onClose={this.onClose} />}
      </div>
    );
  }
 }

export default HomeHeader;
