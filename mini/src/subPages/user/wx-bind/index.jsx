import React, { Component } from 'react';
import Taro, { getCurrentInstance, redirectTo, navigateTo  } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Toast } from '@discuzq/design';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import Page from '@components/page';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';
import layout from './index.module.scss';

const MemoToastProvider = React.memo(ToastProvider);

@inject('site')
@inject('miniBind')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WXBind extends Component {
  getUserProfileCallback = async (params) => {
    const { sessionToken } = getCurrentInstance().router.params;

    try {
      await this.getParamCode();
      const res = await this.props.miniBind.mobilebrowserBind({
        jsCode: this.props.commonLogin.jsCode,
        iv: params.iv,
        encryptedData: params.encryptedData,
        sessionToken,
        type: 'pc'
      });

      checkUserStatus(res);
      if (res.code === 0) {
        this.props.h5QrCode.bindTitle = '已成功绑定';
        this.props.h5QrCode.isBtn = false;
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
        navigateTo({
          url: `/subPages/user/status/index?statusCode=${error.Code}&statusMsg=${error.Message}`
        });
        return;
      }
      if (error.Code) {
        Toast.error({
          content: error.Message,
        });
        return;
      }
      throw {
        Code: 'ulg_9999',
        Message: '网络错误',
        error,
      };
    }
  }

  /**
   * 获取登录信息
   * @returns 登录信息
   */
  getParamCode = () => new Promise((resolve, reject) => {
      Taro.login({
        success: (res) => {
          if(res.errMsg === 'login:ok'){
            this.props.commonLogin.setJsCode(res.code)
            return resolve(res);
          }
          reject(res);
        },
        fail: (err) => {
          reject(err);
        }
      })
    })


  /**
   * 获取用户信息
   * @returns 用户信息
   */
  handleBindCallback = () => new Promise((resolve, reject) => {
    Taro.getUserProfile({
      desc: "账号绑定微信",
      success: (res) => {
        if(res.errMsg === 'getUserProfile:ok'){
          this.getUserProfileCallback(res);
          return resolve(res);
        }
        reject(res);
      },
      fail: (res) => {
        console.log('res', res);
      }
    })
  })

  render() {
    const { nickname } = getCurrentInstance().router.params;

    return (
      <Page>
        <MemoToastProvider>
          <View className={layout.container}>
            <View className={layout.content}>
              <View className={layout.title}>绑定微信</View>
              <View className={layout.tips}>
                {nickname ? `${nickname}，` : ''}{this.props.h5QrCode.bindTitle}
              </View>
              {
                this.props.h5QrCode.isBtn
                ? <Button
                  className={layout.button}
                  type="primary"
                  onClick={this.handleBindCallback}
                >
                  点此，绑定微信，并继续访问
                </Button>
                : <></>
              }
            </View>
          </View>
        </MemoToastProvider>
      </Page>
    );
  }
}

export default WXBind;
