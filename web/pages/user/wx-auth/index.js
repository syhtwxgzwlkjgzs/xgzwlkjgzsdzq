import React from 'react';
import LoginPhoneH5Page from '@layout/user/h5/phone-login';
import { inject } from 'mobx-react';
import { Input, Button, Toast } from '@discuzq/design';
import { h5WechatCodeLogin } from '@server';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCLoginMode from '@common/middleware/HOCLoginMode';
import { get } from '@common/utils/get';
import setAccessToken from '../../../../common/utils/set-access-token';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';
const NEED_BIND_OR_REGISTER_USER = -7016;
@inject('site')
@inject('user')
@inject('commonLogin')
class WeixinAuth extends React.Component {
  async componentDidMount() {
    const { router } = this.props;
    const { code, sessionId, sessionToken, state, action, nickname } = router.query;
    console.log(router.query);

    // 如果要进行绑定逻辑，跳转绑定相关的页面
    if (action === 'wx-bind') {
      router.push(`/user/wx-bind?code=${code}&sessionId=${sessionId}&sessionToken=${sessionToken}&state=${state}&nickname=${nickname}`);
      return;
    }

    try {
      const res = await h5WechatCodeLogin({
        timeout: 10000,
        params: {
          code,
          sessionId,
          sessionToken,
          state,
        },
      });
      checkUserStatus(res);

      // 落地页开关打开
      if (res.code === NEED_BIND_OR_REGISTER_USER) {
        const { sessionToken, accessToken, nickname, uid } = res.data;
        this.props.user.nickname = nickname;
        // 注册成功后，默认登录
        setAccessToken({
          accessToken,
        });
        this.props.user.updateUserInfo(uid);
        router.push({ pathname: 'wx-select', query: { sessionToken, nickname } });
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
        this.props.router.push(`/user/status?statusCode=${error.Code}&statusMsg=${error.Message}`);
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


  render() {
    return <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('weixin')(WeixinAuth));
