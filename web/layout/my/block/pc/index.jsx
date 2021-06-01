import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import SectionTitle from '@components/section-title';
import BaseLayout from '@components/base-layout';
import List from '@components/list';
import Users from '@layout/search/h5/components/active-users';
import Copyright from '@components/copyright';
import ShieldList from './components/shield-list';
import UserCenterFansPc from '@components/user-center/fans-pc';
import UserCenterFollowsPc from '@components/user-center/follows-pc';

@inject('site')
@inject('user')
@observer
class BlockPcPage extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.props.user.getUserShieldList();
  }

  componentWillUnmount() {
    this.props.user.clearUserShield();
  }

  redirectToSearchResultPost = () => {
    this.props.router.push(`/search/result-post?keyword=${this.state.value || ''}`);
  };

  // 加载更多函数
  loadMore = async () => {
    await this.props.user.getUserShieldList();
    return;
  };

  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => (
    <div className={styles.right}>
      <UserCenterFansPc />
      <UserCenterFollowsPc />
      <Copyright />
    </div>
  );
  // 中间 -- 我的屏蔽
  renderContent = (data) => {
    const { user } = this.props;
    const { userShield = [], userShieldPage, userShieldTotalCount, userShieldTotalPage } = user || {};
    console.log(userShield);
    return (
      <div className={styles.content}>
        <div className={styles.section}>
          <SectionTitle
            title="我的屏蔽"
            icon={{ type: 3, name: 'LikeOutlined' }}
            isShowMore={false}
            rightText={`共有${userShieldTotalCount}位用户`}
          />
          <List
            immediateCheck={false}
            showPullDown={false}
            onRefresh={this.loadMore}
            noMore={userShieldTotalPage < userShieldPage}
          >
            <ShieldList data={userShield} />
          </List>
        </div>
      </div>
    );
  };
  render() {
    const { index, site } = this.props;
    return (
      <div className={styles.container}>
        <BaseLayout right={this.renderRight}>{this.renderContent(index)}</BaseLayout>
      </div>
    );
  }
}

export default withRouter(BlockPcPage);
