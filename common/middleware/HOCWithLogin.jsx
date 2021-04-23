
import React from 'react';
import { inject, observer } from 'mobx-react';
import isServer from '@common/utils/is-server';
import Router from '@common/utils/web-router';

// 只能登陆状态才能进入
export default function HOCWithLogin(Component) {
  @inject('user')
  @observer
  class CheckLoginStatus extends React.Component {
    // 应用初始化
    static async getInitialProps(ctx, preProps) {
      if (!preProps) {
        throw Error('CheckLoginStatus必须前置使用HOCFetchSiteData');
      }

      try {
        let __props = {};


        // 服务端，当必须登录的情况下，如果没有检测到登录状态，将不会触发Component的getInitialProps
        if (isServer()) {
          // 传入组件的私有数据
          if (Component.getInitialProps) {
            __props = await Component.getInitialProps(ctx);
          }
        }

        return {
          ...__props,
        };
      } catch (err) {
        console.log('err', err);
        return {};
      }
    }

    constructor(props) {
      super(props);
    }

    componentDidMount() {
      const { user } = this.props;
      if (!user.loginStatus) {
        Router.redirect('/user/login');
      }
    }

    componentDidUpdate() {
      const { user } = this.props;

      if (!user.loginStatus) {
        Router.redirect('/user/login');
      }
    }

    render() {
      const { user } = this.props;
      const { loginStatus } = user;
      if (loginStatus === 'padding' || !loginStatus) return null;
      return <Component {...this.props}/>;
    }
  }

  return CheckLoginStatus;
}
