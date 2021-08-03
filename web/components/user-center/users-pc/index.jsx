import React from 'react';
import SidebarPanel from '@components/sidebar-panel';
import UserCenterUsers from '@components/user-center-users';
import UserCenterUsersPopup from '@components/user-center-users-popup';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import styles from './index.module.scss';
import { withRouter } from 'next/router';

@inject('forum')
@observer
class UserCenterUsersPc extends React.Component {
  static defaultProps = {
    limit: 10,
    className: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showUsersPopup: false,
    };
  }

  // 点击成员更多
  moreUser = () => {
    this.setState({ showUsersPopup: true });
  };

  render() {
    const usersCount = this.props.forum.userTotal;
    return (
      <>
        <SidebarPanel
          type="normal"
          platform={'h5'}
          noData={Number(usersCount) === 0}
          title="成员"
          leftNum={usersCount}
          onShowMore={this.moreUser}
          className={`${this.props.className} ${styles.borderRadius}`}
        >
          {Number(usersCount) !== 0 && (
            <UserCenterUsers
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
              itemStyle={{
                paddingTop: 8,
                paddingBottom: 8,
              }}
              className={styles.usersWrapper}
              limit={this.props.limit}
            />
          )}
        </SidebarPanel>

        <UserCenterUsersPopup
          id={this.props.userId}
          visible={this.state.showUsersPopup}
          onContainerClick={({ id }) => {
            this.props.router.push({
              pathname: '/user/[id]',
              query: {
                id,
              },
            });
          }}
          onClose={() => this.setState({ showUsersPopup: false })}
        />
      </>
    );
  }
}

export default withRouter(UserCenterUsersPc);
