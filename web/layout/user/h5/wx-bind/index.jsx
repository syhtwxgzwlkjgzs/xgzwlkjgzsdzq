import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import { Button, Toast } from '@discuzq/design';
import { h5WechatCodeBind } from '@server';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';
import initJSSdk from '@common/utils/initJSSdk.js';

let bindLoading = false;

@inject('site')
@inject('user')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WeixinBindH5Page extends React.Component {
  componentDidMount() {
    initJSSdk(['closeWindow']);
  }

  render() {
    const { sessionToken, loginType, code, sessionId, state, nickname }  = this.props.router.query;
    const { site } = this.props;
    const { platform } = site;
    return (
      <div className={layout.container}>
        <HomeHeader hideInfo mode='login'/>
        <div className={layout.content}>
          <div className={layout.title}>绑定微信号</div>
          <div className={layout.tips}>
            {nickname ? `${nickname}，` : ''}{this.props.h5QrCode.bindTitle}
          </div>
          {
            this.props.h5QrCode.isBtn
              ? <>
                <Button
                  className={layout.button}
                  type="primary"
                  onClick={() => this.bind({
                    params: { sessionToken, code, sessionId, type: loginType, state },
                  })}
                >
                  绑定微信，并继续访问
                </Button>
                </>
              : <></>
          }
          <div className={layout.functionalRegion}>
            <span className={layout.clickBtn} onClick={() => {
              this.props.h5QrCode.bindTitle = '已取消绑定';
              this.props.h5QrCode.isBtn = false;
              wx.closeWindow();
            }}>
              退出
            </span>
          </div>
        </div>
      </div>
    );
  }

  bind = async (opts) => {
    try {
      if (bindLoading) {
        return;
      }
      bindLoading = true;
      const res = await h5WechatCodeBind({
        url: '/apiv3/users/wechat/h5.bind',
        method: 'GET',
        timeout: 3000,
        ...opts,
      });
      bindLoading = false;
      if (res.code === 0) {
        this.props.h5QrCode.bindTitle = '已成功绑定';
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
      this.props.h5QrCode.bindTitle = '绑定失败，请刷新二维码重新扫码';
      this.props.h5QrCode.isBtn = false;
      // 跳转状态页
      if (error.Code === BANNED_USER || error.Code === REVIEWING || error.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(error.Code, error.Message);
        this.props.router.push(`/user/status?statusCode=${error.Code}&statusMsg=${error.Message}`);
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
}

export default withRouter(WeixinBindH5Page);
