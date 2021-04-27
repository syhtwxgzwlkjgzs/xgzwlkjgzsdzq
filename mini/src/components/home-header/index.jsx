import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
// import Router from '@common/utils/web-router';
import { View, Text, Image } from '@tarojs/components';

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

  getBgHeaderStyle( bgColor) {
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
    if ( siteData && siteData.other ) {
      return {
        countUsers: siteData.other.countUsers, 
        countThreads: siteData.other.countThreads
      }
    }
    return {
      countUsers: 0, 
      countThreads: 0
    }
  }


  render() {
    const { bgColor, hideInfo = false } = this.props;
    const { countUsers, countThreads } = this.getSiteInfo();

    return (
      <View className={styles.container} style={this.getBgHeaderStyle(bgColor)}>
        {hideInfo && <View className={styles.topBar}>
          <View></View>
          <View>
            <Icon onClick={() => {
              Router.redirect('/')
            }} name="HomeOutlined" color="#fff" size={20} />
          </View>
        </View>}
        <View className={styles.logoBox}>
          <Image
              className={styles.logo}
              mode="aspectFit"
              src={this.getLogo()}
          />
        </View>
        {!hideInfo && <View className={styles.siteInfo}>
          <View>
            <Text className={styles.text}>成员</Text>
            <Text className={styles.content}>{countUsers}</Text>
          </View>
          <View>
            <Text className={styles.text}>内容</Text>
            <Text className={styles.content}>{countThreads}</Text>
          </View>
          <View>
            <Icon className={styles.shareIcon} color="#fff" name="ShareAltOutlined"/>
            <Text className={styles.text}>分享</Text>
          </View>
        </View>}
      </View>
    );
  }
}

export default HomeHeader;
