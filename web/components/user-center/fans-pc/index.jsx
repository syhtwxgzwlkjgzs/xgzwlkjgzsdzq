import React from 'react';
import SidebarPanel from '@components/sidebar-panel';
import UserCenterFans from '@components/user-center-fans';
import UserCenterFansPopup from '@components/user-center-fans-popup';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import styles from './index.module.scss';

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
    return (
      <>
        <SidebarPanel
          type="normal"
          noData={Number(this.props.user.fansCount) === 0}
          title="粉丝"
          leftNum={this.props.user.fansCount}
          onShowMore={this.moreFans}
        >
          {Number(this.props.user.fansCount) !== 0 && (
            <UserCenterFans
              style={{
                overflow: 'hidden',
              }}
              onContainerClick={({ id }) => {
                Router.push({ url: `/user/${id}` });
              }}
              className={styles.friendsWrapper}
              limit={5}
            />
          )}
        </SidebarPanel>

        <UserCenterFansPopup
          visible={this.state.showFansPopup}
          onClose={() => this.setState({ showFansPopup: false })}
        />
      </>
    );
  }
}

export default UserCenterFansPc;
