import React from 'react';
import Card from '../index';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Avatar } from '@discuzq/design';
import classNames from 'classnames';
import calcCosImageQuality from '@common/utils/calc-cos-image-quality';
@inject('site')
@inject('user')
@observer
class SiteCard extends React.Component {
  constructor(props) {
    super(props);
    this.content = React.createRef();
    this.state = {
      overMaxHeight: false,
    };
  }
  getSiteInfo() {
    const { site } = this.props;
    const { webConfig } = site;
    const siteInfo = {
      countUsers: 0,
      countThreads: 0,
    };
    if (webConfig && webConfig.other) {
      siteInfo.countUsers = webConfig.other.countUsers;
      siteInfo.countThreads = webConfig.other.countThreads;
    }
    return siteInfo;
  }
  getBgHeaderStyle(bgColor) {
    const { site } = this.props;
    const siteData = site.webConfig || {};

    if (siteData.setSite?.siteBackgroundImage) {
      return { backgroundImage: `url(${siteData.setSite.siteBackgroundImage})` };
    }
    return (bgColor
      ? { background: bgColor }
      : { background: '#2469f6' }
    );
  }
  logoImg = '/dzq-img/admin-logo-x2.png';
  getLogo() {
    const { site } = this.props;
    const siteData = site.webConfig || {};
    if (siteData.setSite?.siteHeaderLogo) {
      return `${siteData.setSite.siteHeaderLogo}?imageMogr2/cgif/10`;
    }
    return this.logoImg;
  }
  componentDidMount = () => {
    if (this.content.current.offsetHeight >= 1900) {
      this.setState({ overMaxHeight: true });
    }
  }
  render() {
    const { bgColor, style = {}, mode = '', site, user } = this.props;
    const { countUsers, countThreads } = this.getSiteInfo();
    const { userInfo } = user;
    const siteData = site.webConfig?.setSite || '';
    const { siteName } = siteData || '';
    let { siteIntroduction } = siteData;
    if (!siteIntroduction) {
      siteIntroduction = 'Discuz！Q官方站点，是中文 PC 互联网最知名的社区开源软件 Discuz!，在过去 15 年间，服务过超过 200 万网站客户。其推出的 UCenter、SupeSite，ECshop 等组件所代表的产品理念对今天移动互联网各类产品的技术架构至今仍有着深远的影响，毫不夸张的说，Discuz! 代表了互联网 2.0 时代里社交网络的最初形态。';
    }
    let targetAvatarImage = userInfo?.avatarUrl;
    if (targetAvatarImage && targetAvatarImage !== '') {
      if (/(http|https):\/\/.*?(gif)/.test(targetAvatarImage)) {
        targetAvatarImage = calcCosImageQuality(targetAvatarImage, 'gif');
      } else {
        targetAvatarImage = calcCosImageQuality(targetAvatarImage, 'png', 5);
      }
    }
    return (
        <Card>
          <div
              className={`${styles.container} ${mode ? styles[`container_mode_${mode}`] : ''}`}
              style={{ ...style, ...this.getBgHeaderStyle(bgColor) }}
          >
            <div className={styles.userInfoBox}>
              <Avatar
                  className={classNames(styles.customAvatar, styles.cursor)}
                  circle={true}
                  image={targetAvatarImage}
                  siz="primary"
                  text={userInfo.nickname && userInfo.nickname.substring(0, 1)}
                ></Avatar>
              <div className={styles.descBox}>
                <div className={styles.nickname}>
                  <span >{`${userInfo.nickname} 推荐`}</span>
                </div>
                <div className={styles.sitename}>
                  <span>{siteName}</span>
                </div>
              </div>
            </div>
            <div className={styles.logoBox}>
                <img
                  className={styles.logo}
                  mode="aspectFit"
                  src={this.getLogo()}
                />
            </div>
            <ul className={styles.siteInfo}>
              <li className={styles.item}>
                <span className={styles.text}>成员</span>
                <span className={styles.content}>{countUsers}</span>
              </li>
              <li className={styles.item}>
                <span className={styles.text}>内容</span>
                <span className={styles.content}>{countThreads}</span>
              </li>
            </ul>
          </div>
          <div className={styles.contentBox} ref={this.content}>
            <div className={styles.contentHeader}>
              <div className={styles.contentHeaderImgBox}>
                <img src='/dzq-img/content-header.png' className={styles.contentHeaderImg}/>
              </div>
              <span className={styles.contentHeaderText}>站点介绍</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.contentText}>
              {siteIntroduction}
            </div>
          </div>
          {this.state.overMaxHeight && (
            <div>
              <div className={styles.rectangleBox}>
                <img src='dzq-img/rectangle.png' className={styles.rectangle}/>
              </div>
              <div className={styles.lookmoreBox}>
                <img src='/dzq-img/look-more.jpg' className={styles.lookmoreImg}/>
              </div>
            </div>
          )}
        </Card>
    );
  }
}

export default SiteCard;
