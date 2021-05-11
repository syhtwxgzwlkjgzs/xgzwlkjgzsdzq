import React from 'react';
import styles from './index.module.scss';
import { Divider } from '@discuzq/design';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterPost from '@components/user-center-post';
import UserCenterFollow from '@components/user-center-follow';
import UserCenterAction from '@components/user-center-action';
import UserCenterThreads from '@components/user-center-threads';
import BottomNavBar from '@components/bottom-nav-bar';
import UserCenterEditInfo from '@components/user-center-edit-info';
import Thread from '@components/thread';
import List from '@components/list';

@inject('site')
@inject('user')
@observer
class H5MyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: [],
    };
  }

  componentDidMount = async () => {
    const threads = await this.props.user.getUserThreads();
    this.setState({
      threads,
    });
  };

  render = () => {
    const { site } = this.props;
    const { platform } = site;
    return <UserCenterEditInfo />
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
        {/* <div className={styles.unit}>
          <UserCenterFollow
            friends={this.props.user.userFollows}
            loadMorePage={true}
            loadMoreAction={this.props.user.getUserFollow}
            hasMorePage={this.props.user.userFollowsTotalPage < this.props.user.userFollowsPage}
          />
        </div> */}

        <div className={styles.unit}>
          <div className={styles.threadUnit}>
            <div className={styles.threadTitle}>主题</div>
            <div className={styles.threadCount}>166个主题</div>
          </div>

          <div className={styles.dividerContainer}>
            <Divider className={styles.divider} />
          </div>

          <div className={styles.threadItemContainer}>
            <UserCenterThreads data={this.state.threads} />
          </div>
        </div>

        <BottomNavBar curr={'my'} placeholder />
      </div>
    );
  };
}

export default H5MyPage;
