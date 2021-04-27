import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Audio, Icon } from '@discuzq/design';
import Page from '@components/page';
import { APP_THEME } from '@common/constants/site';
import styles from './index.module.scss';


@inject('site')
@observer
class Index extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { webConfig, envConfig, theme, changeTheme } = this.props.site;

    return (
      <Page>
        <View>
          <Text className={styles.text}>{envConfig.baseURL}</Text>
          <View className={styles.text}>{theme}</View>
          <Button onClick={() => {
            Taro.navigateTo({
              url: '/pages/threadPost/index'
            })
          }}>去发帖的按钮</Button>
          <Button onClick={() => {
            Taro.navigateTo({
              url: '/pages/thread/index?id=136'
            })
          }}>去详情的按钮</Button>
          <Audio src='https://demo.dj63.com//2016/CLUB商业/club中文/20140101/夏日香气_主题曲_左右为难_电视剧歌曲_韩语.mp3'></Audio>
          <Icon name="LoadingOutlined" size="large" />
          <Icon name="UserOutlined" size="small" />
          <Icon name="UserOutlined" />
        </View>
      </Page>
    );
  }
}

export default Index;
