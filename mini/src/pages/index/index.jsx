import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Audio, Icon } from '@discuzq/design';
import ThemePage from '@components/theme-page';
import { APP_THEME } from '@common/constants/site';
import styles from './index.module.scss';


@inject('site')
@observer
class Index extends Component {

  render() {
    const { envConfig, theme, changeTheme } = this.props.site;

    return (
      <ThemePage>
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
              url: '/pages/thread/index?id=140'
            })
          }}>去详情的按钮</Button>
          <Audio src='https://demo.dj63.com//2016/CLUB商业/club中文/20140101/夏日香气_主题曲_左右为难_电视剧歌曲_韩语.mp3'></Audio>
          <Icon name="LoadingOutlined" size="large" />
          <Icon name="UserOutlined" size="small" />
          <Icon name="UserOutlined" />
        </View>
      </ThemePage>
    );
  }
}

export default Index;
