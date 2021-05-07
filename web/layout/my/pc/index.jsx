import React from 'react';
import styles from './index.module.scss';
import clearLoginStatus from '@common/utils/clear-login-status';
import { Button } from '@discuzq/design';
import UserCenterPost from '@components/user-center-post';

class PCMyPage extends React.Component {
  loginOut() {
    clearLoginStatus();
    window.location.replace('/');
  }

  render() {
    return (
      <div>
        <h1>pc</h1>
        <UserCenterPost />
        <Button onClick={this.loginOut}>退出登录</Button>
      </div>
    );
  }
}

export default PCMyPage;
