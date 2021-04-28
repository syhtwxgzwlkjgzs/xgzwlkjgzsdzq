import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import { get } from '@common/utils/get';
import setAccessToken from '../../../../../common/utils/set-access-token';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';
import { usernameAutoBind } from '@server';

@inject('site')
@inject('user')
@inject('commonLogin')
@observer
class WXSelectH5Page extends React.Component {
  render() {
    const { router } = this.props;
    const { sessionToken, nickname } = router.query;
    return (
      <div className={layout.container}>
        <HomeHeader hideInfo/>
        <div className={layout.content}>
          <div className={layout.title}>绑定微信号</div>
          <div className={layout.tips}>微信用户 {nickname}，请选择您要进行的操作</div>
          <Button
            className={layout.button}
            type="primary"
            onClick={async () => {
              try {
                const res = await usernameAutoBind({
                  timeout: 10000,
                  params: {
                    sessionToken,
                  },
                });
                checkUserStatus(res);
                Toast.success({
                  content: res.code + res.msg,
                });
                if (res.code === 0) {
                  const accessToken = get(res, 'data.accessToken', '');
                  const uid = get(res, 'data.uid', '');
                  // 种下 access_token
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
                  throw error;
                }
                throw {
                  Code: 'ulg_9999',
                  Message: '网络错误',
                  error,
                };
              }
            }}
          >
            微信登录
          </Button>
          {this.props.site.isUserLoginVisible && (
            <Button
              className={layout.button}
              type="primary"
              onClick={() => {
                router.push({ pathname: 'wx-bind-username', query: { sessionToken, nickname } });
              }}
            >
              使用用户名密码登录，并绑定微信
            </Button>
          )}
          {this.props.site.isSmsOpen && (
            <Button
              className={layout.button}
              type="primary"
              onClick={() => {
                router.push({ pathname: 'wx-bind-phone', query: { sessionToken, nickname } });
              }}
            >
              使用手机号登录，并绑定微信
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(WXSelectH5Page);
