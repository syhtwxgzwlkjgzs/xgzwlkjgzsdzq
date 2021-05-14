import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Header from '@components/header';
import UserCenterFllows from '@components/user-center-follow';
import { Divider, Toast } from '@discuzq/design';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
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
    this.props.user.cleanUserFollows();
    this.props.user.cleanTargetUserFollows();
  }

  componentDidMount() {
    this.setState({
      height: window.outerHeight,
      renderComponent: true,
    });
  }


  // 点击关注
  followHandler = async ({ id }) => {
    try {
      await this.props.user.postFollow(id);
      Toast.success({
        content: '关注成功',
        hasMask: false,
        duration: 1000,
      });
      const isOtherFollows = JSON.parse(GetQueryString('isOtherPerson'));
      if (isOtherFollows) {
        const isOtherFollowId = GetQueryString('otherId');
        this.props.user.setTargetUserFollowerBeFollowed(isOtherFollowId);
      } else {
        this.props.user.setUserFollowerBeFollowed(id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 取消关注
  unFollowHandler = async ({ id }) => {
    try {
      await this.props.user.cancelFollow({ id, type: 1 });
      const isOtherFollows = JSON.parse(GetQueryString('isOtherPerson'));
      const isOtherFollowId = GetQueryString('otherId');
      if (isOtherFollows) {
        this.props.user.setTargetUserFollowerBeUnFollowed(isOtherFollowId);
      } else {
        this.props.user.setUserFollowerBeUnFollowed(id);
      }
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
    Router.push({ url: `/my/others?isOtherPerson=${true}&otherId=${id}` });
  }

  // 分割线
  splitElement = () => (
      <div className={styles.splitEmelent}>
        <Divider />
      </div>
  )

  getRenderComponent() {
    const isOtherFollows = JSON.parse(GetQueryString('isOtherPerson'));
    const id = GetQueryString('otherId');
    return (
      <>
        {
          !isOtherFollows ? (
            <UserCenterFllows
              friends={this.props.user.userFollows}
              loadMorePage={true}
              loadMoreAction={this.props.user.getUserFollow}
              hasMorePage={this.props.user.userFollowsTotalPage < this.props.user.userFollowsPage}
              followHandler={this.followHandler}
              unFollowHandler={this.unFollowHandler}
              splitElement={this.splitElement()}
              onContainerClick={this.onContainerClick}
            />
          ) : (
            <UserCenterFllows
              userId={id}
            />
          )
        }
      </>
    );
  }

  render() {
    return (
      <div style={{
        height: this.state.height,
      }}>
        <Header />
        {this.state.renderComponent && this.getRenderComponent()}
      </div>
    );
  }
}

export default withRouter(index);
