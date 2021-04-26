import React, { Component } from 'react';
import { getCurrentInstance  } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Input } from '@discuzq/design';
import Page from '@components/page';
import layout from './index.module.scss';


@inject('site')
@inject('wxPhoneBind')
@observer
class Index extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { wxPhoneBind } = this.props;
    const { nickname } = getCurrentInstance().router.params;

    return (
      <Page>
        <View className={layout.container}>
          <View className={layout.content}>
            <View className={layout.title}>手机号登陆，并绑定微信账号</View>
            <View className={layout.tips}>
              <View>hi， 微信用户 {nickname}</View>
              <View>请您登录，即可完成微信号和手机号的绑定</View>
            </View>
            {/* 输入框 start */}
            <Input
              className={layout.input}
              value=''
              mode="number"
              placeholder="输入您的手机号"
              onChange={(e) => {
              }}
            />
            <Input
              clearable={false}
              className={layout.input}
              mode="number"
              appendWidth="auto"
              append={
                wxPhoneBind.codeTimeout
                ? <View style={{ textAlign: 'right', paddingRight: '6px' }}>{wxPhoneBind.codeTimeout}s后重试</View>
                : <Text size="mini" style={{ textAlign: 'right', paddingRight: '6px' }} onClick={wxPhoneBind.sendCode}>发送验证码</Text>
              }
              value=''
              placeholder="输入您的验证码"
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
