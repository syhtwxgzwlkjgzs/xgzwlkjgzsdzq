import React from 'react';
import styles from './index.module.scss';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterPost from '@components/user-center-post';
import UserCenterFollow from '@components/user-center-follow';
import UserCenterAction from '@components/user-center-action';
import ButtomNavBar from '@components/buttom-nav-bar';
import UserCenterEditInfo from '@components/user-center-edit-info'

@inject('site')
@inject('user')
@observer
class H5MyPage extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    // return <UserCenterEditInfo />
    return (
      <div className={styles.mobileLayout}>
        <UserCenterHeaderImage />
        <UserCenterHead platform={platform} />
        <div className={styles.unit}>
          <UserCenterAction />
        </div>
        <div className={styles.unit}>
          <UserCenterPost />
        </div>
        <div className={styles.unit}>
          <UserCenterFollow
            friends={this.props.user.userFollows}
            loadMorePage={true}
            loadMoreAction={this.props.user.getUserFollow}
            hasMorePage={this.props.user.userFollowsTotalPage < this.props.user.userFollowsPage}
          />
        </div>
        <ButtomNavBar placeholder />
      </div>
    );
  }
}

export default H5MyPage;
