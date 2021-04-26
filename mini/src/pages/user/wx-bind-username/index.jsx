import React, { Component } from 'react';
import { getCurrentInstance  } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Input } from '@discuzq/design';
import Page from '@components/page';
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
      <Page>
        <View className={layout.container}>
          <View className={layout.content}>
            <View className={layout.title}>用户名登录，并绑定微信账号</View>
            <View className={layout.tips}>
              <View>hi， 微信用户 {nickname}</View>
              <View>请您登录，即可完成微信号和用户名的绑定</View>
            </View>
            {/* 输入框 start */}
            <Input
              className={layout.input}
              value=''
              placeholder="输入您的用户名"
              onChange={(e) => {
              }}
            />
            <Input
              clearable={false}
              className={layout.input}
              mode="password"
              value=''
              placeholder="输入您的登录密码"
              onChange={(e) => {
              }}
            />
            {/* 输入框 end */}
            {/* 登录按钮 start */}
            <Button className={layout.button} type="primary" onClick={this.handleLoginButtonClick}>
              登录并绑定
            </Button>
            {/* 登录按钮 end */}
          </View>
        </View>
      </Page>
    );
  }
}

export default Index;
