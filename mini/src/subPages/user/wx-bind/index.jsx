import React, { Component } from 'react';
import Taro, { getCurrentInstance, redirectTo, navigateTo  } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button, Toast } from '@discuzq/design';
import Page from '@components/page';
// import { usernameLogin } from '@server';
// import setAccessToken from '@common/utils/set-access-token';
// import { get } from '@common/utils/get';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';
import layout from './index.module.scss';


@inject('site')
@inject('miniBind')
@inject('commonLogin')
@observer
class WXBind extends Component {
  getUserProfileCallback = async (params) => {
    const { sessionToken = 'HZYvKnJgXfmtQkVgrYDlxdlVi0QZQ5E4' } = getCurrentInstance().router.params;

    try {
      await this.getParamCode();
      const res = await this.props.miniBind.mobilebrowserBind({
        jsCode: this.props.commonLogin.jsCode,
        iv: params.iv,
        encryptedData: params.encryptedData,
        sessionToken,
        type: 'pc'
      });
      console.log(params)
      console.log(res)

      checkUserStatus(res);
      if (res.code === 0) {
        Toast.success({
          content: '绑定成功',
        });
        redirectTo({
          url: `/subPages/index/index`
        });
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
          url: `/subPages/user/status?statusCode=${error.Code}&statusMsg=${error.Message}`
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
      // <Page>
        <View className={layout.container}>
          <View className={layout.content}>
            <View className={layout.title}>绑定微信</View>
            <View className={layout.tips}>{nickname}，小虫，请绑定您的微信</View>
            <Button
              className={layout.button}
              type="primary"
              onClick={this.handleBindCallback}
            >
              点此，绑定微信，并继续访问
            </Button>
          </View>
        </View>
      // </Page>
    );
  }
}

export default WXBind;
