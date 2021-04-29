import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../h5/components/section-title'
import TrendingTopicMore from './components/trending-topic-more';
import ThreadContent from '@components/thread';
import ActiveUsersMore from './components/active-users-more';
import Stepper from './components/stepper';
import goToLoginPage from '@common/utils/go-to-login-page';
import { Toast } from '@discuzq/design';

@inject('site')
@inject('search')
@inject('user')
@observer
class SearchPCPage extends React.Component {

  state = {
    keyword: ''
  }

  redirectToSearchResultPost = () => {
    this.props.router.push(`/search/result-post?keyword=${this.state.keyword || ''}`);
  };

  redirectToSearchResultUser = () => {
    this.props.router.push(`/search/result-user?keyword=${this.state.keyword || ''}`);
  };

  redirectToSearchResultTopic = () => {
    this.props.router.push(`/search/result-topic?keyword=${this.state.keyword || ''}`);
  };

  onUserClick = data => console.log('user click', data);

  onTopicClick = data => {
    const { topicId } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`);
  };

  onPostClick = data => console.log('post click', data);

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (value) => {
    this.props.router.replace(`/search?keyword=${value}`);
    this.setState({ keyword: value }, () => {
      this.searchData(value);
    });
  }

  onFollow = ({ id, type }) => {
    if (!this.props.user.isLogin()) {
      Toast.info({ content: '请先登录!' });
      goToLoginPage({ url: '/user/login' });
      return;
    }
    if (type === '1') {
      this.props.search.postFollow(id).then(result => {
        if (result) {
          this.props.search.updateActiveUserInfo(id, { isFollow: true })
        }
      })
    } else {
      this.props.search.cancelFollow({ id, type: 1 }).then(result => {
        if (result) {
          this.props.search.updateActiveUserInfo(id, { isFollow: false })
        }
      })
    }
  }

  // 右侧 - 步骤条
  renderRight = () => {
    return (
      <div className={styles.searchRight}>
        <Stepper/>
      </div>
    )
  }
  // 中间 -- 潮流话题 活跃用户 热门内容
  renderContent = () => {
    const { indexTopics, indexUsers, indexThreads } = this.props.search;

    const { pageData: topicsPageData = [] } = indexTopics || {};
    const { pageData: usersPageData = [] } = indexUsers || {};
    const { pageData: threadsPageData = [] } = indexThreads || {};
    // TODO 添加活跃用户和当前用户是同一人的判断
    return (
      <div className={styles.searchContent}>
        <div className={styles.section}>
          <SectionTitle title="潮流话题" onShowMore={this.redirectToSearchResultTopic} />
          <TrendingTopicMore data={topicsPageData} onItemClick={this.onTopicClick}/>
        </div>
        <div className={styles.section}>
          <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser} />
          <ActiveUsersMore data={usersPageData} onItemClick={this.onUserClick} onFollow={this.onFollow} />
        </div>
        <div className={styles.section}>
          <SectionTitle title="热门内容" onShowMore={this.redirectToSearchResultPost} />
          {
            threadsPageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />)
          }
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className={styles.searchWrap}>
        <BaseLayout
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent() }
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(SearchPCPage);
