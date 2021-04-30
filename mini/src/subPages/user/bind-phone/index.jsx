import React from 'react';
import { inject, observer } from 'mobx-react';
import { getCurrentInstance, navigateTo, redirectTo } from '@tarojs/taro';
import { withRouter } from 'next/router';
import { Button, Toast, Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';


@inject('site')
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
    const { wxPhoneBind } = this.props;
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
                value={wxPhoneBind.mobile}
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
                  : <Text size="mini" style={{ textAlign: 'right', paddingRight: '6px' }} onClick={wxPhoneBind.sendCode}>发送验证码</Text>
                }
                value={wxPhoneBind.code}
                placeholder="输入您的验证码"
                onChange={(e) => {
                  wxPhoneBind.code = e.target.value;
                }}
              />
              {/* 输入框 end */}
            <Button className={layout.button} type="primary" onClick={this.handleBindButtonClick}>
              下一步
            </Button>
            <View className={layout.functionalRegion}>
              <Text className={layout.clickBtn} onClick={() => {
                this.props.router.push('login');
              }} >退出登录</Text>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}

export default withRouter(BindPhoneH5Page);
