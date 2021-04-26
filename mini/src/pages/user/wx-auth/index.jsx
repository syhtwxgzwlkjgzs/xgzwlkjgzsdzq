import React from 'react';
import Taro, { navigateTo  } from '@tarojs/taro';
import { inject } from 'mobx-react';
import { Toast } from '@discuzq/design';
import { miniLogin } from '@server';
import { get } from '@common/utils/get';
import setAccessToken from '@common/utils/set-access-token';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';

const NEED_BIND_OR_REGISTER_USER = -7016;
@inject('site')
@inject('user')
@inject('commonLogin')
class MiniAuth extends React.Component {
  async componentDidMount() {

    try {
      await this.getParamCode();
      const params = await this.getUserInfo(); // 获取参数
      // 小程序登录
      const res = await miniLogin({
        timeout: 10000,
        params: {
          jsCode: this.props.commonLogin.jsCode,
          iv: params.iv,
          encryptedData: params.encryptedData
        },
      });

      // 落地页开关打开
      if (res.code === NEED_BIND_OR_REGISTER_USER) {
        const { sessionToken, accessToken, nickname, uid } = res.data;
        this.props.user.nickname = nickname;
        // 注册成功后，默认登录
        setAccessToken({
          accessToken,
        });
        this.props.user.updateUserInfo(uid);
        navigateTo({
          url: `/pages/wx-select/index?sessionToken=${sessionToken}&nickname=${nickname}`
        });
        return;
      }

      if (res.code === 0) {
        const accessToken = get(res, 'data.accessToken');
        const uid = get(res, 'data.uid');
        // 注册成功后，默认登录
        setAccessToken({
          accessToken,
        });
        this.props.user.updateUserInfo(uid);
        window.location.href = '/index';
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
          url: `/pages/user/status?statusCode=${error.Code}&statusMsg=${error.Message}`
        });
        return;
      }
      if (error.Code) {
        Toast.error({
          content: error.Message,
        });
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
  getUserInfo = () => new Promise((resolve, reject) => {
    Taro.getUserInfo({
      desc: "t偷你猴子哦",
      success: (res) => {
        console.log('res', res);
        if(res.errMsg === 'getUserInfo:ok'){
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
    return <></>;
  }
}

export default MiniAuth;
