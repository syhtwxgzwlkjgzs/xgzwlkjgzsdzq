import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Button, Toast, Avatar, Icon } from '@discuzq/design';
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
    const { router, user } = this.props;
    const { sessionToken, nickname } = router.query;
    return (
      <div className={layout.container}>
        <HomeHeader hideInfo mode='login'/>
        <div className={layout.content}>
          <div className={layout.title}>绑定微信号</div>
          <div className={layout.tips}>
            <div className={layout.tips_user}>
              hi，
              {
                nickname
                  ? <>
                      亲爱的<Avatar
                        style={{margin: '0 8px'}}
                        circle
                        size='small'
                        image={user.avatarUrl}
                        text={nickname && nickname.substring(0, 1)}
                        />{nickname}
                    </>
                  : '微信用户'
                }
            </div>
            请选择您要进行的操作
          </div>
          <Button
            className={`${layout.button} ${layout.btn_select} ${layout.btn_wx}`}
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
                  content: res.msg,
                  duration: 1000,
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
            <Icon name='WechatOutlined' size={16}/>
            微信登录
          </Button>
          {this.props.site.isUserLoginVisible && (
            <Button
              className={`${layout.button} ${layout.btn_select} ${layout.btn_user}`}
              type="primary"
              onClick={() => {
                router.push({ pathname: 'wx-bind-username', query: { sessionToken, nickname } });
              }}
            >
              <Icon name='UserOutlined' size={16}/>
              用户名登录绑定微信
            </Button>
          )}
          {this.props.site.isSmsOpen && (
            <Button
              className={`${layout.button} ${layout.btn_select} ${layout.btn_phone}`}
              type="primary"
              onClick={() => {
                router.push({ pathname: 'wx-bind-phone', query: { sessionToken, nickname } });
              }}
            >
              <Icon name='PhoneOutlined' size={16}/>
              手机号登录绑定微信
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(WXSelectH5Page);
