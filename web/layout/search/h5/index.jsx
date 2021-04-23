import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/search-input';
import SearchInput from '@components/search-input';
import List from '@components/list';
import SectionTitle from './components/section-title';
import TrendingTopics from './components/trending-topics';
import ActiveUsers from './components/active-users';
import PopularContents from './components/popular-contents';
import Header from '@components/header';
import NoData from '@components/no-data';

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
      <List className={styles.page} allowRefresh={false}>
        <Header />
        <div className={styles.section}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
          <SectionTitle icon={{ type: 1, name: 'StrongSharpOutlined' }} title="潮流话题" onShowMore={this.redirectToSearchResultTopic} />
          {
            topicsPageData && topicsPageData.length
              ? <TrendingTopics data={topicsPageData} onItemClick={this.onTopicClick} />
              : <NoData />
          }
        </div>
        <div className={styles.hr} />
        <div className={styles.section}>
          <SectionTitle icon={{ type: 2, name: 'MemberOutlined' }} title="活跃用户" onShowMore={this.redirectToSearchResultUser} />
          {
            usersPageData && usersPageData.length
              ? <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
              : <NoData />
          }
        </div>
        <div className={styles.hr} />
        <div className={`${styles.section} ${styles.popularContents}`}>
          <SectionTitle icon={{ type: 3, name: 'HotOutlined' }} title="热门内容" onShowMore={this.redirectToSearchResultPost} />
        </div>
        {
          threadsPageData && threadsPageData.length
            ? <PopularContents data={threadsPageData} onItemClick={this.onPostClick} />
            : <NoData />
        }
      </List>
    );
  }
}

export default withRouter(SearchH5Page);
