import React from 'react';
import { inject, observer } from 'mobx-react';
import { getCurrentInstance, navigateTo, redirectTo } from '@tarojs/taro';
import { withRouter } from 'next/router';
import { Button, Toast, Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';
import layout from './index.module.scss';


@inject('site')
@inject('user')
@inject('wxPhoneBind')
@inject('mobileBind')
@observer
class BindPhoneH5Page extends React.Component {

  handleBindButtonClick = async () => {
    try {
      const { sessionToken } = getCurrentInstance().router.params;
      const resp = await this.props.mobileBind.bind(sessionToken);
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
        onClose: () => {
          redirectTo({
            url: `/pages/index/index`
          });
        }
      });
    } catch (e) {
      // 跳转状态页
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
  }

  render() {
    const { mobileBind } = this.props;
    return (
      <Page>
        <View className={layout.container}>
          {/* <Header/> */}
          <View className={layout.content}>
            <View className={layout.title}>绑定手机号</View>
            <View className={layout.tips}>
              请绑定您的手机号
            </View>
            {/* 输入框 start */}
            <Input
              className={layout.input}
              value={mobileBind.mobile}
              mode="number"
              placeholder="输入您的手机号"
              onChange={(e) => {
                mobileBind.mobile = e.target.value;
              }}
            />
            <View className={layout.captchaInput}>
              <Input
                clearable={false}
                className={layout.input}
                mode="number"
                appendWidth="auto"
                value={mobileBind.code}
                placeholder="输入您的验证码"
                onChange={(e) => {
                  mobileBind.code = e.target.value;
                }}
              />
              {mobileBind.codeTimeout ? (
                <View className={layout.countDown}>{mobileBind.codeTimeout}s后重试</View>
              ) : (
                <Text size="mini" className={layout.sendCaptcha} onClick={mobileBind.sendCode}>发送验证码</Text>
              )}
            </View>
            {/* 输入框 end */}
            <Button className={layout.button} type="primary" onClick={this.handleBindButtonClick}>
              下一步
            </Button>
            <View className={layout.functionalRegion}>
              <Text className={layout.clickBtn} onClick={() => {
                redirectTo({
                  url: `/subPages/user/wx-auth/index`
                });
              }} >退出登录</Text>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}

export default withRouter(BindPhoneH5Page);
