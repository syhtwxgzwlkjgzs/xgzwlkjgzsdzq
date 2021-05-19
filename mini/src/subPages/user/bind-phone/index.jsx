import React from 'react';
import { inject, observer } from 'mobx-react';
import { getCurrentInstance, navigateTo, redirectTo } from '@tarojs/taro';
import { withRouter } from 'next/router';
import { Button, Toast, Input } from '@discuzq/design';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { toTCaptcha } from '@common/utils/to-tcaptcha'
import { get } from '@common/utils/get';
import layout from './index.module.scss';


@inject('site')
@inject('user')
@inject('wxPhoneBind')
@inject('mobileBind')
@inject('commonLogin')
@observer
class BindPhoneH5Page extends React.Component {
  constructor() {
    super();
    this.ticket = ''; // 腾讯云验证码返回票据
    this.randstr = ''; // 腾讯云验证码返回随机字符串
  }


  componentDidMount() {
    // 监听腾讯验证码事件
    Taro.eventCenter.on('captchaResult', this.handleCaptchaResult);
    Taro.eventCenter.on('closeChaReault', this.handleCloseChaReault);
  }

  componentWillUnmount() {
    // 卸载监听腾讯验证码事件
    Taro.eventCenter.off('captchaResult', this.handleCaptchaResult)
    Taro.eventCenter.off('closeChaReault', this.handleCloseChaReault)
  }

  // 验证码滑动成功的回调
  handleCaptchaResult = (result) => {
    this.ticket = result.ticket;
    this.randstr = result.randstr;
  }

  // 验证码点击关闭的回调
  handleCloseChaReault = () => {
    this.ticket = '';
    this.randstr = '';
  }

  handleSendCodeButtonClick = async () => {
    try{
      // 发送前校验
      this.props.mobileBind.beforeSendVerify();
      // 验证码
      const { webConfig } = this.props.site;
      const qcloudCaptcha = webConfig?.qcloud?.qcloudCaptcha;
      if (qcloudCaptcha) {
        const qcloudCaptchaAppId = webConfig?.qcloud?.qcloudCaptchaAppId;
        await toTCaptcha(qcloudCaptchaAppId)
      };
      // 发送
      await this.props.mobileBind.sendCode({
        captchaRandStr: this.ticket,
        captchaTicket: this.randstr
      });
    }catch(e){
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

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
              clearable
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
                <Text size="mini" className={layout.sendCaptcha} onClick={this.handleSendCodeButtonClick}>发送验证码</Text>
              )}
            </View>
            {/* 输入框 end */}
            <Button className={layout.button} type="primary" onClick={this.handleBindButtonClick}>
              下一步
            </Button>
            <View className={layout.functionalRegion}>
              <Text className={layout.clickBtn} onClick={() => {
                redirectTo({
                  url: `/pages/index/index`
                });
              }} >跳过</Text>
            </View>
          </View>
        </View>
      </Page>
    );
  }
}

export default withRouter(BindPhoneH5Page);
