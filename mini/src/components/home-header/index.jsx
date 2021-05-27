import React, { useMemo } from 'react';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import { inject, observer } from 'mobx-react';
import { View, Text, Image, Button } from '@tarojs/components';
import Router from '@discuzq/sdk/dist/router';
import SharePopup from '../thread/share-popup';
import isWeiXin from '@common/utils/is-weixin';
import goToLoginPage from '@common/utils/go-to-login-page';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import logoImg from '../../../../web/public/dzq-img/admin-logo-x2.png'
import Taro from '@tarojs/taro'
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
    height: 180
  }

  domRef = React.createRef(null)

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
      return siteData.setSite.siteLogo;
    }
    return logoImg;
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

  onClose = () => {
    this.setState({ visible: false });
  }

  componentDidMount() {
    if (this.domRef.current) {
      this.setState({ height: this.domRef.current.clientHeight })
    }
  }
  render() {
    const { bgColor, hideInfo = false, style = {}, digest = null, mode = '' } = this.props;
    const { visible } = this.state;
    const { countUsers, countThreads } = this.getSiteInfo();

    return (
      <View ref={this.domRef}
        className={`${styles.container} ${mode ? styles[`container_mode_${mode}`] : ''}`} 
        style={{...style, ...this.getBgHeaderStyle(bgColor)}}
      >
        {hideInfo && <View className={styles.topBar}>
          {
            mode === 'login'
              ? <View onClick={() => Router.back()} className={styles.left}>
                  <Icon name="LeftOutlined" /><Text>返回</Text>
                </View>
              : <></>
          }
          <View>
            <Icon onClick={() => {
              Router.redirect({url:'/'});
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
          <Button className={styles.item} openType="share" plain='true'>
            <Icon className={styles.shareIcon} name="ShareAltOutlined"/>
            <Text className={styles.text}>分享</Text>
          </Button>
        </View>}
        {isWeiXin && <SharePopup visible={visible} onClose={this.onClose} />}
      </View>
    );
  }
}

export default HomeHeader;
