import React from 'react';
import { inject, observer } from 'mobx-react';
import Taro, { getCurrentInstance, navigateTo, redirectTo, navigateBack } from '@tarojs/taro';
import Button from '@discuzq/design/dist/components/button/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Input from '@discuzq/design/dist/components/input/index';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, isExtFieldsOpen } from '@common/store/login/util';
import { toTCaptcha } from '@common/utils/to-tcaptcha'
import PhoneInput from '@components/login/phone-input'
import { get } from '@common/utils/get';
import layout from './index.module.scss';
import { MOBILE_LOGIN_STORE_ERRORS } from '@common/store/login/mobile-login-store';


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
    this.onFocus = () => {}
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
    this.handleSendCodeButtonClick();
  }

  // 验证码点击关闭的回调
  handleCloseChaReault = () => {
    this.ticket = '';
    this.randstr = '';
  }

  handleSendCodeButtonClick = async (onFocus) => {
    try{
      // 发送前校验
      this.props.mobileBind.beforeSendVerify();
      if (onFocus) {
        this.onFocus = onFocus;
      }
      // 验证码
      const { webConfig } = this.props.site;
      const qcloudCaptcha = webConfig?.qcloud?.qcloudCaptcha;
      if (qcloudCaptcha) {
        if (!this.ticket || !this.randstr) {
          const qcloudCaptchaAppId = webConfig?.qcloud?.qcloudCaptchaAppId;
          toTCaptcha(qcloudCaptchaAppId)
          return false;
        }
      };
      // 发送
      await this.props.mobileBind.sendCode({
        captchaRandStr: this.randstr,
        captchaTicket: this.ticket
      });
      // 清除
      this.ticket = '';
      this.randstr = '';
      this.onFocus();
    }catch(e){
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 2000,
      });
    }
  }

  handleBindButtonClick = async () => {
    try {
      const { sessionToken, from = '' } = getCurrentInstance().router.params;
      const resp = await this.props.mobileBind.bind(sessionToken);
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 2000,
        onClose: () => {
          if (from === 'userCenter') {
            navigateBack();
            return;
          }
          redirectTo({
            url: `/pages/index/index`
          });
        }
      });
    } catch (e) {
      // 注册信息补充
      if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_COMPLETE_REQUIRED_INFO.Code) {
        if (isExtFieldsOpen(this.props.site)) {
          this.props.commonLogin.needToCompleteExtraInfo = true;
          redirectTo({ url: '/subPages/user/supplementary/index' });
          return;
        }
        redirectTo({ url: '/pages/index/index' });
        return;
      }

      // 跳转状态页
      if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
        const uid = get(e, 'uid', '');
        uid && this.props.user.updateUserInfo(uid);
        this.props.commonLogin.setStatusMessage(e.Code, e.Message);
        navigateTo({
          url: `/subPages/user/status/index?statusCode=${e.Code}&statusMsg=${e.Message}`
        });
        return;
      }
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 2000,
      });
    }
  }

  handlePhoneNumCallback = (phoneNum) => {
    const { mobileBind } = this.props;
    mobileBind.mobile = phoneNum;
  };

  handlePhoneCodeCallback = (code) => {
    const { mobileBind } = this.props;
    mobileBind.code = code;
  };

  render() {
    const { mobileBind } = this.props;
    const { from = '' } = getCurrentInstance().router.params;
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
            <PhoneInput
              phoneNum={mobileBind.mobile}
              captcha={mobileBind.code}
              phoneNumCallback={this.handlePhoneNumCallback}
              phoneCodeCallback={this.handlePhoneCodeCallback}
              sendCodeCallback={this.handleSendCodeButtonClick}
              codeTimeout={mobileBind.codeTimeout}
            />
            {/* 输入框 end */}
            <Button className={layout.button} type="primary" onClick={this.handleBindButtonClick}>
              {from === 'userCenter' ? '绑定' : '下一步'}
            </Button>
            {
              from !== 'userCenter'
              && (
                <View className={layout.functionalRegion}>
                  <Text className={layout.clickBtn} onClick={() => {
                    redirectTo({
                      url: `/pages/index/index`
                    });
                  }} >跳过</Text>
                </View>
              )
            }
          </View>
        </View>
      </Page>
    );
  }
}

export default BindPhoneH5Page;
