import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { View, Text, Image } from '@tarojs/components';
import logoImg from '../../../../web/public/dzq-img/admin-logo-x2.png'

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
    return logoImg;
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
    const { bgColor, hideInfo = false, style = {}, digest = null } = this.props;
    const { countUsers, countThreads } = this.getSiteInfo();

    return (
      <View className={styles.container} style={{style, ...this.getBgHeaderStyle(bgColor)}}>
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
        {digest && <View className={styles.digest}>
            <Text className={styles.left}>站长 {digest.admin || ''}</Text>
            <Text className={styles.right}>已创建 {digest.day || ''}天</Text>
        </View>}
        {!hideInfo && <View className={styles.siteInfo}>
          <View className={styles.item}>
            <Text className={styles.text}>成员</Text>
            <Text className={styles.content}>{countUsers}</Text>
          </View>
          <View className={styles.item}>
            <Text className={styles.text}>内容</Text>
            <Text className={styles.content}>{countThreads}</Text>
          </View>
          <View className={styles.item}>
            <Icon className={styles.shareIcon} size={16} color="#fff" name="ShareAltOutlined"/>
            <Text className={styles.text}>分享</Text>
          </View>
        </View>}
      </View>
    );
  }
}

export default HomeHeader;
