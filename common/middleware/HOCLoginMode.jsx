import React from 'react';
import { inject } from 'mobx-react';
import isServer from '@common/utils/is-server';

function HOCLoginMode(mode) {
  return (Component) => {
    @inject('site')
    class HOCLoginModeComponent extends React.Component {
      constructor(props) {
        super(props);

        if (isServer()) return;

        const currentMode = this.getCurrentMode();

        // 微信模式页面，不兼容用户名模式和手机号模式
        if (mode === 'wechat') {
          if (currentMode !== 'wechat') {
            this.props.router.replace('/user/login');
          }
        }

        // 手机号模式页面，不兼容用户名模式
        if (mode === 'phone') {
          if (currentMode === 'user') {
            this.props.router.replace('/user/login');
          }
        }

        // 用户名模式下，使用此模式的页面限定只能在用户名模式中开启
        if (mode === 'user') {
          if (currentMode !== 'user') {
            this.props.router.replace('/user/login');
          }
        }

        // 用户名注册模式下，使用此模式的页面限定只能在用户名模式中开启
        if (mode === 'register') {
          if (currentMode !== 'user') {
            this.props.router.replace('/user/register');
          }
        }
      }

      getCurrentMode = () => {
        let currentMode = null;

        if (this.props.site.wechatEnv !== null) {
          currentMode = 'wechat';
          return currentMode;
        }

        if (this.props.site.isSmsOpen) {
          currentMode = 'mobile';
          return currentMode;
        }

        currentMode = 'user';
        return currentMode;
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    return HOCLoginModeComponent;
  };
}

export default HOCLoginMode;
