import React from 'react';
import styles from './index.module.scss';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import clearLoginStatus from '@common/utils/clear-login-status';
import { Button } from '@discuzq/design';
import UserCenterPost from '@components/user-center-post';
import UserCenterFollow from '@components/user-center-follow';
import UserCenterAction from '@components/user-center-action';
import UserCenterEditInfo from '../../../components/user-center-edit-info/index'

@inject('site')
@inject('user')
@observer
class H5MyPage extends React.Component {
  
  loginOut() {
    clearLoginStatus();
    window.location.replace('/');
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    // return (
    //   <UserCenterEditInfo />
    // )
    return (
      <div>
        <UserCenterHeaderImage />
        <UserCenterHead platform={platform} />
        <div className={styles.unit}>
          <UserCenterAction />
        </div>
        <div className={styles.unit}>
          <UserCenterPost />
        </div>
        <div className={styles.unit}>
          <UserCenterFollow />
        </div>
        <Button onClick={this.loginOut}>退出登录</Button>
      </div>
    );
  }
}

export default H5MyPage;
