import React, { Component } from 'react';
import { getCurrentInstance, redirectTo  } from '@tarojs/taro';
import { View, Navigator } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Toast } from '@discuzq/design';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import Page from '@components/page';
import { miniLogin } from '@server';
import { checkUserStatus } from '@common/store/login/util';
import layout from './index.module.scss';
import { getParamCode, getUserProfile } from '../common/utils'

const MemoToastProvider = React.memo(ToastProvider);
const NEED_BIND_OR_REGISTER_USER = -7016;

@inject('site')
@inject('miniBind')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WXAuthorization extends Component {

  authorization = async (params) => {
    const { sessionToken, inviteCode } = getCurrentInstance().router.params;
    try {
      await getParamCode(this.props.commonLogin);
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
        this.props.h5QrCode.loginTitle = '已成功登录';
        this.props.h5QrCode.isBtn = false;
        return;
      }
      checkUserStatus(res);
      throw {
        Code: res.code,
        Message: res.msg,
      };
    } catch (error) {
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
    const { nickname } = getCurrentInstance().router.params;

    return (
      <Page>
        <MemoToastProvider>
          <View className={layout.container}>
            <View className={layout.content}>
              <View className={layout.title}>授权登录小程序</View>
              <View className={layout.tips}>
                {nickname ? `${nickname}，` : ''}{this.props.h5QrCode.loginTitle}
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
              <View className={layout.functionalRegion}>
                <Navigator openType='exit' target='miniProgram' className={layout.clickBtn} onClick={() => {
                  this.props.h5QrCode.loginTitle = '已取消登录';
                  this.props.h5QrCode.isBtn = false;
                }}>
                  退出
                </Navigator>
              </View>
            </View>
          </View>
        </MemoToastProvider>
      </Page>
    );
  }
}

export default WXAuthorization;
