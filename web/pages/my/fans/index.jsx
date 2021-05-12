import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Header from '@components/header';
import UserCenterFans from '@components/user-center-fans';
import { Divider, Toast } from '@discuzq/design';
import styles from './index.module.scss';
import { withRouter } from 'next/router';
import Router from '@discuzq/sdk/dist/router';
import GetQueryString from '../../../../common/utils/get-query-string';

@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '100%',
      renderComponent: null,
    };
    this.props.user.cleanUserFans()
    this.props.user.cleanTargetUserFans()
  }

  componentDidMount() {
    this.setState({
      height: window.outerHeight,
      renderComponent: this.getRenderComponent()
    });
  }

  // 点击关注
  followHandler = async ({ id }) => {
    try {
      await this.props.user.postFollow(id)
      const isOtherFans = JSON.parse(GetQueryString('isOtherPerson'));
      const isOtherFansId = GetQueryString('otherId');
      if (isOtherFans) {
        this.props.user.setTargetUserFansBeFollowed(isOtherFansId)
      } else {
        this.props.user.setUserFansBeFollowed(id)
      }
      this.setState({
        renderComponent:this.getRenderComponent()
      })
      Toast.success({
        content: '关注成功',
        hasMask: false,
        duration: 1000,
      })
    } catch (error) {
      console.log(error);
    }
  }

  // 取消关注
  unFollowHandler = async ({ id }) => {
    try {
      await this.props.user.cancelFollow({ id, type: 1 })
      const isOtherFans = JSON.parse(GetQueryString('isOtherPerson'));
      if (isOtherFans) {
        const isOtherFansId = GetQueryString('otherId');
        this.props.user.setTargetUserFansBeUnFollowed(isOtherFansId);
      } else {
        this.props.user.setUserFansBeUnFollowed(id);
      }
      this.setState({
        renderComponent:this.getRenderComponent()
      })
      Toast.success({
        content: '取消成功',
        hasMask: false,
        duration: 1000,
      });
    } catch (error) {
      console.log(error);
    }
  }

  onContainerClick = ({ id }) => {
    Router.push({ url: `/my/others?isOtherPerson=${true}&otherId=${id}` })
  }

  splitElement = () => (
    <div className={styles.splitEmelent}>
      <Divider />
    </div>
  )

  getRenderComponent = () => {
    const isOtherFans = JSON.parse(GetQueryString('isOtherPerson'));
    const id = GetQueryString('otherId');
    console.log(this.props.user.targetUserFans);
    return (
      <>
        {
          !isOtherFans ? (
            <UserCenterFans
              friends={this.props.user.userFans}
              loadMorePage={true}
              loadMoreAction={this.props.user.getUserFans}
              hasMorePage={this.props.user.userFansTotalPage < this.props.user.userFansPage}
              followHandler={this.followHandler}
              unFollowHandler={this.unFollowHandler}
              splitElement={this.splitElement()}
              onContainerClick={this.onContainerClick}
            />
          ) : (
            <UserCenterFans
              friends={this.props.user.targetUserFans}
              loadMorePage={true}
              loadMoreAction={async () => {
                if (id) {
                  await this.props.user.getTargetUserFans(id)
                }
              }}
              hasMorePage={this.props.user.userFansTotalPage < this.props.user.targetUserFansPage}
              followHandler={this.followHandler}
              unFollowHandler={this.unFollowHandler}
              splitElement={this.splitElement()}
              onContainerClick={this.onContainerClick}
            />
          )
        }
      </>
    )
  }

  render() {
    return (
      <div style={{
        height: this.state.height,
      }}>
        <Header />
        {this.state.renderComponent}
      </div>
    );
  }
}

export default withRouter(index);
