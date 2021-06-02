import React from 'react';
import SidebarPanel from '@components/sidebar-panel';
import UserCenterFans from '@components/user-center-fans';
import UserCenterFansPopup from '@components/user-center-fans-popup';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import styles from './index.module.scss';
import { withRouter } from 'next/router';

@inject('user')
@observer
class UserCenterFansPc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFansPopup: false,
    };
  }

  // 点击粉丝更多
  moreFans = () => {
    this.setState({ showFansPopup: true });
  };

  render() {
    const fansCount = this.props.userId ? this.props.user.targetUserFansCount : this.props.user.followCount;
    return (
      <>
        <SidebarPanel
          type="normal"
          noData={Number(fansCount) === 0}
          title="粉丝"
          leftNum={fansCount}
          onShowMore={this.moreFans}
        >
          {Number(fansCount) !== 0 && (
            <UserCenterFans
              style={{
                overflow: 'hidden',
              }}
              userId={this.props.userId}
              onContainerClick={({ id }) => {
                this.props.router.push({
                  pathname: '/user/[id]',
                  query: {
                    id,
                  },
                });
              }}
              className={styles.friendsWrapper}
              limit={5}
            />
          )}
        </SidebarPanel>

        <UserCenterFansPopup
          id={this.props.userId}
          visible={this.state.showFansPopup}
          onContainerClick={({ id }) => {
            this.props.router.push({
              pathname: '/user/[id]',
              query: {
                id,
              },
            });
          }}
          onClose={() => this.setState({ showFansPopup: false })}
        />
      </>
    );
  }
}

export default withRouter(UserCenterFansPc);
