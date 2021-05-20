import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Input, Button, Toast, Avatar } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';

@inject('site')
@inject('user')
@inject('userLogin')
@inject('commonLogin')
@observer
class WXBindUsernameH5page extends React.Component {
  handleLoginButtonClick = async () => {
    try {
      await this.props.userLogin.login();
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
      // FIXME: Toast 暂时不支持回调能力
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (e) {
      if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(e.Code, e.Message);
        this.props.router.push(`/user/status?statusCode=${e.Code}&statusMsg=${e.Message}`);
        return;
      }

      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };
  render() {
    const { userLogin, router } = this.props;
    const { nickname, avatarUrl } = router.query;
    userLogin.sessionToken = router.query.sessionToken;
    return (
      <div className={layout.container}>
        <HomeHeader hideInfo mode='login'/>
        <div className={layout.content}>
          <div className={layout.title}>用户名登录，并绑定微信账号</div>
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
                        image={avatarUrl}
                        text={nickname && nickname.substring(0, 1)}
                        />{nickname}
                    </>
                  : '微信用户'
                }
            </div>
            请您登录，即可完成微信号和用户名的绑定
          </div>
          {/* 输入框 start */}
          <Input
            className={layout.input}
            value={userLogin.username}
            placeholder="输入您的用户名"
            clearable={true}
            onChange={(e) => {
              userLogin.username = e.target.value;
            }}
          />
          <Input
            clearable={false}
            className={layout.input}
            mode="password"
            value={userLogin.password}
            placeholder="输入您的登录密码"
            onChange={(e) => {
              userLogin.password = e.target.value;
            }}
          />
          {/* 输入框 end */}
          {/* 登录按钮 start */}
          <Button className={layout.button} type="primary" onClick={this.handleLoginButtonClick}>
            登录并绑定
          </Button>
          {/* 登录按钮 end */}
        </div>
      </div>
    );
  }
}

export default withRouter(WXBindUsernameH5page);
