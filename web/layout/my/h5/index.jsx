import React from 'react';
import styles from './index.module.scss';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import clearLoginStatus from '@common/utils/clear-login-status';
import { Button } from '@discuzq/design';
import UserCenterPost from '@components/user-center-post';
import UserCenterFriends from '../../../components/user-center-friends';

@inject('site')
@observer
class H5MyPage extends React.Component {
  loginOut() {
    clearLoginStatus();
    window.location.replace('/');
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    return (
            <div>
                <UserCenterPost />
                <UserCenterFriends />
                <UserCenterHeaderImage/>
                <UserCenterHead platform={platform}/>
                <Button onClick={this.loginOut}>退出登录</Button>
            </div>
    );
  }
}

export default H5MyPage;
