import React, { Component } from 'react';
import { getCurrentInstance, redirectTo  } from '@tarojs/taro';
import { View, Navigator } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Button from '@discuzq/design/dist/components/button/index';
import Toast from '@discuzq/design/dist/components/toast/index';
// import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import Page from '@components/page';
import { miniLogin } from '@server';
import { checkUserStatus } from '@common/store/login/util';
import layout from './index.module.scss';
import { getParamCode, getUserProfile } from '../common/utils'

// const MemoToastProvider = React.memo(ToastProvider);
const NEED_BIND_OR_REGISTER_USER = -7016;

@inject('site')
@inject('miniBind')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WXAuthorization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginTitle: `你确定要授权登录${props.site.siteName}吗？`
    }
  }

  async componentDidMount() {
    await getParamCode(this.props.commonLogin)
  }

  authorization = async (params) => {
    const { scene: sessionToken, inviteCode } = getCurrentInstance().router.params;
    try {
      // 小程序登录
      const res = await miniLogin({
        timeout: 10000,
        data: {
          jsCode: this.props.commonLogin.jsCode,
          iv: params.iv,
          encryptedData: params.encryptedData,
          inviteCode,
          sessionToken
        },
      });

      // 落地页开关打开
      if (res.code === NEED_BIND_OR_REGISTER_USER) {
        const { sessionToken, nickname } = res.data;
        redirectTo({
          url: `/subPages/user/wx-select/index?sessionToken=${sessionToken}&nickname=${nickname}`
        });
        return;
      }
      if (res.code === 0) {
        this.setState({
          loginTitle: '已成功登录'
        })
        this.props.h5QrCode.isBtn = false;
        return;
      }
      checkUserStatus(res);
      throw {
        Code: res.code,
        Message: res.msg,
      };
    } catch (error) {
      this.setState({
        loginTitle: '登录失败，请刷新二维码重新扫码'
      });
      this.props.h5QrCode.isBtn = false;
      Toast.error({
        content: error.Message,
      });
      throw {
        Code: 'ulg_9999',
        Message: '网络错误',
        error,
      };
    }
  }

  render() {
    const { nickname } = getCurrentInstance()?.router?.params || {};

    return (
      <Page>
        {/* <MemoToastProvider> */}
          <View className={layout.container}>
            <View className={layout.content}>
              <View className={layout.title}>授权登录小程序</View>
              <View className={layout.tips}>
                {nickname ? `${nickname}，` : ''}{this.state.loginTitle}
              </View>
              {
                this.props.h5QrCode.isBtn
                ? <Button
                  className={layout.button}
                  type="primary"
                  onClick={() => {getUserProfile(this.authorization)}}
                >
                  确定
                </Button>
                : <></>
              }
              <Button className={layout.exit}>
                <Navigator openType='exit' target='miniProgram' className={layout.clickBtn} onClick={() => {
                  this.setState({
                    loginTitle: '已取消登录'
                  })
                  this.props.h5QrCode.isBtn = false;
                }}>
                  退出
                </Navigator>
              </Button>
            </View>
          </View>
        {/* </MemoToastProvider> */}
      </Page>
    );
  }
}

export default WXAuthorization;
