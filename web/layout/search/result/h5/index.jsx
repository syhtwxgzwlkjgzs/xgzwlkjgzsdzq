import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import BaseLayout from '@components/base-layout';
import SearchInput from '@components/search-input';
import SectionTitle from '@components/section-title'
import SearchPosts from './components/search-posts';
import SearchTopics from './components/search-topics';
import SearchUsers from './components/search-users';
import NoData from '@components/no-data';


import styles from './index.module.scss';

@inject('site')
@inject('search')
@observer
class SearchResultH5Page extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

    this.state = {
      keyword,
    };

    // 进入页面时搜索
    this.searchData(keyword);
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

  onCancel = () => {
    this.props.router.back();
  };

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (keyword) => {
    // query 更新
    this.props.router.replace(`/search/result?keyword=${keyword}`);
    this.setState({ keyword }, () => {
      this.searchData(keyword);
    });
  };

  onUserClick = data => console.log('user click', data);

  onTopicClick = data => console.log('topic click', data);

  onPostClick = data => console.log('post click', data);

  render() {
    const { keyword } = this.state;
    const { searchTopics, searchUsers, searchThreads } = this.props.search;
    const { pageData: topicsPageData = [] } = searchTopics || {};
    const { pageData: usersPageData = [] } = searchUsers || {};
    const { pageData: threadsPageData = [] } = searchThreads || {};

    return (
      <BaseLayout allowRefresh={false}>
        <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />

        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        <div className={styles.section}>
          <SectionTitle title="用户" onShowMore={this.redirectToSearchResultUser} />
        </div>
        {
          usersPageData?.length
            ? <SearchUsers data={usersPageData} onItemClick={this.onUserClick} />
            : <NoData />
        }

        <div className={styles.hr}></div>
        <div className={styles.section}>
          <SectionTitle title="主题" onShowMore={this.redirectToSearchResultPost} />
        </div>
        {
          threadsPageData?.length
            ? <SearchPosts data={threadsPageData} onItemClick={this.onPostClick} />
            : <NoData />
        }

        <div className={styles.hr}></div>
        <div className={styles.section}>
          <SectionTitle title="话题" onShowMore={this.redirectToSearchResultTopic} />
        </div>
        {
          topicsPageData?.length
            ? <SearchTopics data={topicsPageData} onItemClick={this.onTopicClick} />
            : <NoData />
        }

      </BaseLayout>
    );
  }
}

export default withRouter(SearchResultH5Page);
