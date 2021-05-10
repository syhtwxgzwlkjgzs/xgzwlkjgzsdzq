import React from 'react';
import styles from './index.module.scss';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterPost from '@components/user-center-post';
import UserCenterFollow from '@components/user-center-follow';
import UserCenterAction from '@components/user-center-action';
import BottomNavBar from '@components/bottom-nav-bar';
import UserCenterEditInfo from '@components/user-center-edit-info';
import Thread from '@components/thread';

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

    console.log(threads);
  };

  render = () => {
    const { site } = this.props;
    const { platform } = site;
    // return <UserCenterEditInfo />
    console.log(this.state.threads);
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
          {this.state.threads.map((thread, index) => <Thread data={thread} key={index} />)}
        </div>

        <BottomNavBar placeholder />
      </div>
    );
  };
}

export default H5MyPage;
