import React, { Component } from 'react';
import { getCurrentInstance, navigateTo  } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button } from '@discuzq/design';
import ThemePage from '@components/theme-page';
import layout from './index.module.scss';


@inject('site')
@observer
class Index extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { nickname } = getCurrentInstance().router.params;

    return (
      <ThemePage>
        <View className={layout.container}>
          <View className={layout.content}>
            <View className={layout.title}>绑定微信号</View>
            <View className={layout.tips}>微信用户 {nickname}，请选择您要进行的操作</View>
            <Button
              className={layout.button}
              type="primary"
              onClick={async () => {
                navigateTo({
                  url: '/pages/user/status/index?statusCode=2&statusMsg=原因不明，我也想知道'
                })
              }}
            >
              微信登录
            </Button>
            <Button
              className={layout.button}
              type="primary"
              onClick={() => {
                navigateTo({
                  url: '/pages/user/wx-bind-username/index?nickname=test'
                })
              }}
            >
              使用用户名密码登录，并绑定微信
            </Button>
            <Button
              className={layout.button}
              type="primary"
              onClick={() => {
                navigateTo({
                  url: '/pages/user/wx-bind-phone/index?nickname=test'
                })
              }}
            >
              使用手机号登录，并绑定微信
            </Button>
          </View>
        </View>
      </ThemePage>
    );
  }
}

export default Index;
