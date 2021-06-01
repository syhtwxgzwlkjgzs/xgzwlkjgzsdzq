import React, { Component } from 'react';
import { getCurrentInstance, navigateTo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Input from '@discuzq/design/dist/components/input/index';
import Button from '@discuzq/design/dist/components/button/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import Page from '@components/page';
import { get } from '@common/utils/get';
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
      const resp = await this.props.userLogin.login();
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
        onClose: () => {
          navigateTo({
            url: `/pages/index/index`
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
    const { userLogin, commonLogin } = this.props;
    const { nickname, sessionToken } = getCurrentInstance().router.params;
    userLogin.sessionToken = sessionToken;

    return (
      <Page>
        <MemoToastProvider>
        <View className={layout.container}>
          <View className={layout.content}>
            <View className={layout.title}>用户名登录，并绑定微信账号</View>
            <View className={layout.tips}>
              <View style={{display: 'flex' }}>hi， 微信用户<Avatar style={{margin: '0 8px'}} circle size='small' image={commonLogin.avatarUrl}/>{nickname}</View>
              <View>请您登录，即可完成微信号和用户名的绑定</View>
            </View>
            {/* 输入框 start */}
            <Input
              clearable
              className={layout.input}
              value={userLogin.username}
              placeholder="输入您的用户名"
              onChange={(e) => {
                userLogin.username = e.target.value;
              }}
            />
            <Input
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
