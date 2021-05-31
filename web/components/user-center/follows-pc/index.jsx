import React from 'react';
import SidebarPanel from '@components/sidebar-panel';
import UserCenterFollowPopup from '@components/user-center-follow-popup';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import styles from './index.module.scss';
import UserCenterFollows from '../../user-center-follow';

@inject('user')
@observer
class UserCenterFollowsPc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFollowsPopup: false,
    };
  }

  // 点击粉丝更多
  moreFollow = () => {
    this.setState({ showFollowsPopup: true });
  };

  render() {
    const followCount = this.props.userId ? this.props.user.targetUserFollowCount : this.props.user.followCount;
    return (
      <>
        <SidebarPanel
          type="normal"
          noData={Number(followCount) === 0}
          title="关注"
          leftNum={followCount}
          onShowMore={this.moreFollow}
        >
          {Number(followCount) !== 0 && (
            <UserCenterFollows
              style={{
                overflow: 'hidden',
              }}
              userId={this.props.userId}
              onContainerClick={({ id }) => {
                Router.push({ url: `/user/${id}` });
              }}
              className={styles.friendsWrapper}
              limit={5}
            />
          )}
        </SidebarPanel>

        <UserCenterFollowPopup
          id={this.props.userId}
          visible={this.state.showFollowsPopup}
          onClose={() => this.setState({ showFollowsPopup: false })}
        />
      </>
    );
  }
}

export default UserCenterFollowsPc;
