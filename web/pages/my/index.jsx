import React from 'react';
import styles from './index.module.scss';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithLogin from '@common/middleware/HOCWithLogin';
import Header from '@components/header';
import { Button } from '@discuzq/design';
import clearLoginStatus from '@common/utils/clear-login-status'; 
import Router from '@discuzq/sdk/dist/router';

class MyCenter extends React.Component {

  loginOut() {
    clearLoginStatus();
    Router.replace({url: '/'});
  }

  render() {
    return (
      <div className='index'>
        <Header/>
        <h1>敬请期待</h1>
        <Button onClick={this.loginOut}>退出登录</Button>
      </div>
    );
  }
}

export default HOCFetchSiteData(HOCWithLogin(MyCenter));
