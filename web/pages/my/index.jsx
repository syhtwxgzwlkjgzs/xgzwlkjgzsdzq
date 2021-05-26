import React from 'react';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithLogin from '@middleware/HOCWithLogin';
import { inject, observer } from 'mobx-react';
import MyH5Page from '@layout/my/h5';
import MyPCPage from '@layout/my/pc';
import clearLoginStatus from '@common/utils/clear-login-status';
import { Button } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
@inject('site')
@observer
class MyCenter extends React.Component {
  logout = () => {
    clearLoginStatus();
    window.location.replace('/');
  };
  render() {

    return (
      <div style={{marginTop: '100px', display: 'flex', flexDirection:'column',alignItems: 'center', justifyContent: 'center', padding: '30px 0'}}>
        <h2>功能开发中！</h2>
        <div style={{marginTop: '30px'}}>
          <Button style={{marginRight: '20px'}} onClick={() => {Router.back()}} size='large' type='primary'>返回</Button>
          <Button onClick={() => {this.logout()}} size='large' type='primary'>退出登录</Button>
        </div>
      </div>
    );

    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <MyPCPage />;
    }

    return <MyH5Page />;
  }
}

export default HOCFetchSiteData(HOCWithLogin(MyCenter));
