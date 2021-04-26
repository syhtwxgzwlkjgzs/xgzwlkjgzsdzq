import React, { Component } from 'react';
import { getCurrentInstance, navigateTo  } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Toast } from '@discuzq/design';
import Page from '@components/page';
import { usernameLogin } from '@server';
import setAccessToken from '@common/utils/set-access-token';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';
import { get } from '@common/utils/get';
import layout from './index.module.scss';


@inject('site')
@observer
class Index extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleLoginCallback = async () => {
    const { sessionToken } = getCurrentInstance().router.params;

    try {
      const res = await usernameLogin({
        timeout: 10000,
        params: {
          username: '',
          password: '',
          type: 'mobilebrowser_username_login',
          sessionToken,
        },
      });
      checkUserStatus(res);
      Toast.success({
        content: res.code + res.msg,
      });
      if (res.code === 0) {
        const accessToken = get(res, 'data.accessToken', '');
        const uid = get(res, 'data.uid', '');
        // 种下 access_token
        setAccessToken({
          accessToken,
        });
        this.props.user.updateUserInfo(uid);
        window.location.href = '/index';
        return;
      }
      throw {
        Code: res.code,
        Message: res.msg,
      };
    } catch (error) {
      // 跳转状态页
      if (error.Code === BANNED_USER || error.Code === REVIEWING || error.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(error.Code, error.Message);
        this.props.router.push(`/user/status?statusCode=${error.Code}&statusMsg=${error.Message}`);
        return;
      }
      if (error.Code) {
        throw error;
      }
      throw {
        Code: 'ulg_9999',
        Message: '网络错误',
        error,
      };
    }
  }

  render() {
    const { nickname, sessionToken } = getCurrentInstance().router.params;

    return (
      <Page>
        <View className={layout.container}>
          <View className={layout.content}>
            <View className={layout.title}>绑定微信号</View>
            <View className={layout.tips}>微信用户 {nickname}，请选择您要进行的操作</View>
            <Button
              className={layout.button}
              type="primary"
              onClick={this.handleLoginCallback}
            >
              创建新账号
            </Button>
            <Button
              className={layout.button}
              type="primary"
              onClick={() => {
                navigateTo({
                  url: `/pages/user/wx-bind-username/index?sessionToken=${sessionToken}&nickname=${nickname}`
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
                  url: `/pages/user/wx-bind-phone/index?sessionToken=${sessionToken}&nickname=${nickname}`
                })
              }}
            >
              使用手机号登录，并绑定微信
            </Button>
          </View>
        </View>
      </Page>
    );
  }
}

export default Index;
