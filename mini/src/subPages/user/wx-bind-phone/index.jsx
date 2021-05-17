import React, { Component } from 'react';
import { getCurrentInstance, navigateTo } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Input, Toast, Avatar } from '@discuzq/design';
import Taro from '@tarojs/taro';
import { toTCaptcha } from '@common/utils/to-tcaptcha'
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import Page from '@components/page';
import layout from './index.module.scss';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';

const MemoToastProvider = React.memo(ToastProvider)

@inject('site')
@inject('user')
@inject('commonLogin')
@inject('wxPhoneBind')
@observer
class Index extends Component {
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
    console.log('captcha：', result);
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
      const { webConfig } = this.props.site;
      const qcloudCaptchaAppId = webConfig?.qcloud?.qcloudCaptchaAppId;
      await toTCaptcha(qcloudCaptchaAppId);

      // 发送前校验
      this.props.wxPhoneBind.beforeSendVerify();
      await this.props.wxPhoneBind.sendCode({
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
    const { wxPhoneBind } = this.props;
    const { sessionToken } = getCurrentInstance().router.params;
    try {
      const resp = await wxPhoneBind.loginAndBind(sessionToken);
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        duration: 1000,
        onClose: () => {
          navigateTo({
            url: `/pages/index/index`
          });
        }
      });
    } catch (error) {
      // 跳转状态页
      if (error.Code === BANNED_USER || error.Code === REVIEWING || error.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(error.Code, error.Message);
        navigateTo({
          url: `/subPages/user/status/index?statusCode=${error.Code}&statusMsg=${error.Message}`
        });
        return;
      }
      Toast.error({
        content: error.Message,
      });
    }
  }

  render() {
    const { wxPhoneBind, commonLogin } = this.props;
    const { nickname } = getCurrentInstance().router.params;

    return (
      <Page>
        <MemoToastProvider>
        <View className={layout.container}>
          <View className={layout.content}>
            <View className={layout.title}>手机号登陆，并绑定微信账号</View>
            <View className={layout.tips}>
              <View style={{display: 'flex' }}>hi， 微信用户<Avatar style={{margin: '0 8px'}} circle size='small' image={commonLogin.avatarUrl}/>{nickname}</View>
              <View>请您登录，即可完成微信号和用户名的绑定</View>
            </View>
            {/* 输入框 start */}
            <Input
              className={layout.input}
              value={wxPhoneBind.mobile}
              mode="number"
              clearable
              placeholder="输入您的手机号"
              onChange={(e) => {
                wxPhoneBind.mobile = e.target.value;
              }}
            />
            <View className={layout.captchaInput}>
              <Input
                clearable={false}
                className={layout.input}
                mode="number"
                appendWidth="auto"
                value={wxPhoneBind.code}
                placeholder="输入您的验证码"
                onChange={(e) => {
                  wxPhoneBind.code = e.target.value;
                }}
              />
              {wxPhoneBind.codeTimeout ? (
                <View className={layout.countDown}>{wxPhoneBind.codeTimeout}s后重试</View>
              ) : (
                <Text size="mini" className={layout.sendCaptcha} onClick={wxPhoneBind.sendCode}>发送验证码</Text>
              )}
            </View>
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
