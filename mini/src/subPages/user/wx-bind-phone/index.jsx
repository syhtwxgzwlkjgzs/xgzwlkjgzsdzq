import React, { Component } from 'react';
import { getCurrentInstance  } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Page from '@components/page';
import layout from './index.module.scss';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';

@inject('site')
@inject('wxPhoneBind')
@observer
class Index extends Component {
  handleSendCodeButtonClick = async () => {
    try {
      await this.props.wxPhoneBind.sendCode();
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };
  handleBindButtonClick = async () => {
    const { wxPhoneBind, router } = this.props;
    const { sessionToken } = router.query;
    try {
      const resp = await wxPhoneBind.loginAndBind(sessionToken);
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        duration: 1000,
      });

      setTimeout(() => {
        router.push('/index');
      }, 1000);
    } catch (error) {
      // 跳转状态页
      if (error.Code === BANNED_USER || error.Code === REVIEWING || error.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(error.Code, error.Message);
        this.props.router.push(`/user/status?statusCode=${error.Code}&statusMsg=${error.Message}`);
        return;
      }
      Toast.error({
        content: error.Message,
      });
    }
  }

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
                wxPhoneBind.mobile = e.target.value;
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
                : <Text size="mini" style={{ textAlign: 'right', paddingRight: '6px' }} onClick={this.handleSendCodeButtonClick}>发送验证码</Text>
              }
              value=''
              placeholder="输入您的验证码"
              onChange={(e) => {
                wxPhoneBind.code = e.target.value;
              }}
            />
            {/* 输入框 end */}
            {/* 登录按钮 start */}
            <Button className={layout.button} type="primary" onClick={this.handleBindButtonClick}>
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
