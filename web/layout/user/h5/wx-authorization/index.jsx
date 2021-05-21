import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import { Button, Toast } from '@discuzq/design';
import { h5WechatCodeLogin } from '@server';
import setAccessToken from '@common/utils/set-access-token';
import { get } from '@common/utils/get';
import { checkUserStatus } from '@common/store/login/util';
import initJSSdk from '@common/utils/initJSSdk.js';

const NEED_BIND_OR_REGISTER_USER = -7016;
let bindLoading = false;
@inject('site')
@inject('user')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WXAuthorizationPage extends React.Component {
  componentDidMount() {
    initJSSdk(['closeWindow']);
  }
  render() {
    const { site } = this.props;
    const { platform } = site;
    return (
      <div className={layout.container}>
        <HomeHeader hideInfo mode='login'/>
        <div className={layout.content}>
          <div className={layout.title}>{this.props.h5QrCode.loginTitle}</div>
          {
            this.props.h5QrCode.isBtn
              ? <>
                  <Button
                    className={layout.button}
                    type="primary"
                    onClick={this.authorization}
                  >
                    确定
                  </Button>
                </>
              : <></>
          }
          <div className={layout.functionalRegion}>
              <span className={layout.clickBtn} onClick={() => {
                this.props.h5QrCode.loginTitle = '已取消登录';
                this.props.h5QrCode.isBtn = false;
                wx.closeWindow();
              }}>
                退出登录
              </span>
            </div>
        </div>
      </div>
    );
  }

  authorization = async () => {
    const { router } = this.props;
    const { code, sessionId, sessionToken, state, type } = router.query;
    try {
      if (bindLoading) {
        return;
      }
      bindLoading = true;
      const res = await h5WechatCodeLogin({
        timeout: 10000,
        params: {
          code,
          sessionId,
          sessionToken,
          state,
        },
      });
      bindLoading = false;

      // 落地页开关打开
      if (res.code === NEED_BIND_OR_REGISTER_USER) {
        const { sessionToken, nickname } = res.data;
        router.push({ pathname: 'wx-select', query: { sessionToken, nickname } });
        return;
      }

      if (res.code === 0 && type === 'h5') {
        const accessToken = get(res, 'data.accessToken');
        const uid = get(res, 'data.uid');
        // 注册成功后，默认登录
        setAccessToken({
          accessToken,
        });
        this.props.user.updateUserInfo(uid);
        window.location.href = '/';
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
      bindLoading = false;
      this.props.h5QrCode.loginTitle = `${JSON.stringify(error)}'登录失败，请刷新二维码重新扫码'`;
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
}

export default withRouter(WXAuthorizationPage);
