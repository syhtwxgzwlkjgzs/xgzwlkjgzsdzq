import React from 'react';
import SidebarPanel from '@components/sidebar-panel';
import UserCenterFollowPopup from '@components/user-center-follow-popup';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import styles from './index.module.scss';
import UserCenterFollows from '../../user-center-follow';
import { withRouter } from 'next/router';

@inject('user')
@observer
class UserCenterFollowsPc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFollowsPopup: false,
      dataSource: {},
      sourcePage: 1,
      sourceTotalPage: 1,
    };
  }

  // 点击粉丝更多
  moreFollow = () => {
    this.setState({ showFollowsPopup: true });
  };

  setDataSource = (targetData) => {
    this.setState({
      dataSource: targetData,
    });
  };

  updateSourcePage = (newPage) => {
    this.setState({
      sourcePage: newPage,
    });
  };

  updateSourceTotalPage = (newTotalPage) => {
    this.setState({
      sourceTotalPage: newTotalPage,
    });
  };

  render() {
    let followCount = 0;
    if (this.props.userId) {
      if (this.props.userId === this.props.user?.id) {
        followCount = this.props.user.followCount
      } else {
        followCount = this.props.user.targetUserFollowCount
      }
    } else {
      followCount = this.props.user.followCount
    }
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
              dataSource={this.state.dataSource}
              setDataSource={this.setDataSource}
              sourcePage={this.state.sourcePage}
              updateSourcePage={this.updateSourcePage}
              sourceTotalPage={this.state.sourceTotalPage}
              updateSourceTotalPage={this.updateSourceTotalPage}
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
                paddingLeft: 0,
                paddingRight: 0,
              }}
              className={styles.friendsWrapper}
              limit={5}
            />
          )}
        </SidebarPanel>

        <UserCenterFollowPopup
          id={this.props.userId}
          dataSource={this.state.dataSource}
          setDataSource={this.setDataSource}
          sourcePage={this.state.sourcePage}
          updateSourcePage={this.updateSourcePage}
          sourceTotalPage={this.state.sourceTotalPage}
          updateSourceTotalPage={this.updateSourceTotalPage}
          visible={this.state.showFollowsPopup}
          onContainerClick={({ id }) => {
            this.props.router.push({
              pathname: '/user/[id]',
              query: {
                id,
              },
            });
          }}
          onClose={() => this.setState({ showFollowsPopup: false })}
        />
      </>
    );
  }
}

export default withRouter(UserCenterFollowsPc);
