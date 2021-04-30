import React, { Component } from 'react';
import { getCurrentInstance, navigateTo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Input, Button, Toast } from '@discuzq/design';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import Page from '@components/page';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import layout from './index.module.scss';

const MemoToastProvider = React.memo(ToastProvider)

@inject('site')
@inject('user')
@inject('userLogin')
@inject('commonLogin')
@observer
class Index extends Component {
  handleBindButtonClick = async () => {
    try {
      await this.props.userLogin.login();
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
        onClose: () => {
          navigateTo({
            url: `/subPages/index/index`
          });
        }
      });
    } catch (e) {
      if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(e.Code, e.Message);
        navigateTo({
          url: `/subPages/user/status/index?statusCode=${e.Code}&statusMsg=${e.Message}`
        });
        return;
      }

      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };

  render() {
    const { userLogin } = this.props;
    const { nickname, sessionToken } = getCurrentInstance().router.params;
    userLogin.sessionToken = sessionToken;

    return (
      <Page>
        <MemoToastProvider>
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
              value={userLogin.username}
              placeholder="输入您的用户名"
              onChange={(e) => {
                userLogin.username = e.target.value;
              }}
            />
            <Input
              clearable={false}
              className={layout.input}
              mode="password"
              value={userLogin.password}
              placeholder="输入您的登录密码"
              onChange={(e) => {
                userLogin.password = e.target.value;
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
        </MemoToastProvider>
      </Page>
    );
  }
}

export default Index;
