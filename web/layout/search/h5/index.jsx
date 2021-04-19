import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/search-input';
import SearchInput from '.././../../components/search-input';
import SectionTitle from './components/section-title';
import TrendingTopics from './components/trending-topics';
import ActiveUsers from './components/active-users';
import PopularContents from './components/popular-contents';
import Header from '@components/header';

import styles from './index.module.scss';
import '@discuzq/design/dist/styles/index.scss';

@inject('site')
@inject('search')
@observer
class SearchH5Page extends React.Component {
  onSearch = (keyword) => {
    this.props.router.push(`/search/result?keyword=${keyword || ''}`);
  };

  redirectToSearchResultPost = () => {
    this.props.router.push('/search/result-post');
  };

  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  };

  redirectToSearchResultTopic = () => {
    this.props.router.push('/search/result-topic');
  };
  onUserClick = data => console.log('user click', data);
  onTopicClick = data => console.log('topic click', data);
  onPostClick = data => console.log('post click', data);

  onCancel = () => {
    this.props.router.back();
  };

  render() {
    const { indexTopics, indexUsers, indexThreads } = this.props.search;
    const { pageData: topicsPageData } = indexTopics;
    const { pageData: usersPageData } = indexUsers;
    const { pageData: threadsPageData } = indexThreads;
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.section}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
          <SectionTitle title="潮流话题" onShowMore={this.redirectToSearchResultTopic} />
          <TrendingTopics data={topicsPageData} onItemClick={this.onTopicClick} />
        </div>
        <div className={styles.hr} />
        <div className={styles.section}>
          <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser} />
          <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
        </div>
        <div className={styles.hr} />
        <div className={`${styles.section} ${styles.popularContents}`}>
          <SectionTitle title="热门内容" onShowMore={this.redirectToSearchResultPost} />
        </div>
        <PopularContents data={threadsPageData} onItemClick={this.onPostClick} />
      </div>
    );
  }
}

export default withRouter(SearchH5Page);
