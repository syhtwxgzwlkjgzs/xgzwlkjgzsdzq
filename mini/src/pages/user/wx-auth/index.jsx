import React from 'react';
import Taro, { getCurrentInstance, redirectTo  } from '@tarojs/taro';
import { inject } from 'mobx-react';
import { Toast, Popup } from '@discuzq/design';
import { Button, View } from '@tarojs/components';
import { miniLogin } from '@server';
import setAccessToken from '@common/utils/set-access-token';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';
import layout from './index.module.scss';

const NEED_BIND_OR_REGISTER_USER = -7016;
@inject('site')
@inject('user')
@inject('commonLogin')
class MiniAuth extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isVisible: true
    }
  }
  async componentDidMount() {
    const { action, sessionToken } = getCurrentInstance().router.params;
    // 其他地方跳入的小程序绑定流程
    if(action === 'mini-bind'){
      redirectTo({
        url: `/pages/wx-bind/index?sessionToken=${sessionToken}`
      })
      return;
    }
  }

  getUserProfileCallback = async (params) => {
    const { inviteCode = '' } = getCurrentInstance().router.params;
    try {
      await this.getParamCode();
      // 小程序登录
      const resp = await miniLogin({
        timeout: 10000,
        params: {
          jsCode: this.props.commonLogin.jsCode,
          iv: params.iv,
          encryptedData: params.encryptedData,
          inviteCode
        },
      });
      console.log({
        jsCode: this.props.commonLogin.jsCode,
        iv: params.iv,
        encryptedData: params.encryptedData,
        inviteCode
      });
      checkUserStatus(resp);
      // 优先判断是否能登录
      if (resp.code === 0) {
        const { accessToken, uid } = resp.data;
        setAccessToken({
          accessToken,
        });
        this.props.user.updateUserInfo(uid);
        redirectTo({
          url: `/pages/index/index`
        });
        return;
      }
      // 落地页开关打开
      if (resp.code === NEED_BIND_OR_REGISTER_USER) {
        const { sessionToken, nickname } = resp.data;
        this.props.user.nickname = nickname;
        redirectTo({
          url: `/pages/user/wx-select/index?sessionToken=${sessionToken}&nickname=${nickname}`
        });
        return;
      }
      throw {
        Code: resp.code,
        Message: resp.msg,
      };
    } catch (error) {
      // 跳转状态页
      if (error.Code === BANNED_USER || error.Code === REVIEWING || error.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(error.Code, error.Message);
        redirectTo({
          url: `/pages/user/status/index?statusCode=${error.Code}&statusMsg=${error.Message}`
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
  getUserProfile = () => new Promise((resolve, reject) => {
    this.setState({
      isVisible: false
    })
    Taro.getUserProfile({
      desc: "查询用户是否绑定过账号",
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
    return (
      <Popup
        position="bottom"
        visible={this.state.isVisible}
      >
        <View  className={layout.modal} >
          <Button className={layout.button} onClick={this.getUserProfile}>微信快捷登录</Button>
        </View>
      </Popup>
      );
  }
}

export default MiniAuth;
