import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button } from '@discuzq/design';
import ThemePage from '@components/theme-page';
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
        </View>
      </ThemePage>
    );
  }
}

export default Index;
