import React, { Component} from 'react';
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
    this.props.user.cleanUserFans();
    this.props.user.cleanTargetUserFans();
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
      const isOtherFans = JSON.parse(GetQueryString('isOtherPerson'));
      const isOtherFansId = GetQueryString('otherId');
      if (isOtherFans) {
        this.props.user.setTargetUserFansBeFollowed(id);
      } else {
        this.props.user.setUserFansBeFollowed(id);
      }
      Toast.success({
        content: '关注成功',
        hasMask: false,
        duration: 1000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 取消关注
  unFollowHandler = async ({ id }) => {
    try {
      await this.props.user.cancelFollow({ id, type: 1 });
      const isOtherFans = JSON.parse(GetQueryString('isOtherPerson'));
      if (isOtherFans) {
        this.props.user.setTargetUserFansBeUnFollowed(id);
      } else {
        this.props.user.setUserFansBeUnFollowed(id);
      }
      this.setState({
        renderComponent: this.getRenderComponent(),
      });
      Toast.success({
        content: '取消成功',
        hasMask: false,
        duration: 1000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  onContainerClick = ({ id }) => {
    Router.push({ url: `/my/others?isOtherPerson=${true}&otherId=${id}` });
  };

  splitElement = () => (
    <div className={styles.splitEmelent}>
      <Divider />
    </div>
  );

  getRenderComponent = () => {
    const isOtherFans = JSON.parse(GetQueryString('isOtherPerson'));
    const id = GetQueryString('otherId');
    return (
      <>
        {!isOtherFans ? (
          <UserCenterFans onContainerClick={this.onContainerClick} />
        ) : (
          <UserCenterFans userId={id} onContainerClick={this.onContainerClick} />
        )}
      </>
    );
  };

  render() {
    return (
      <div
        style={{
          height: this.state.height,
        }}
      >
        <Header />
        {this.state.renderComponent && this.getRenderComponent()}
      </div>
    );
  }
}

export default withRouter(index);
