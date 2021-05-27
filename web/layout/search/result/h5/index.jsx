import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import BaseLayout from '@components/base-layout';
import SearchInput from '@components/search-input';
import SearchPosts from './components/search-posts';
import SearchTopics from './components/search-topics';
import SearchUsers from './components/search-users';
import SidebarPanel from '@components/sidebar-panel';

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

  onUserClick = (userId) => {
    this.props.router.push(`/user/${userId}`);
  };

  // 跳转话题详情
  onTopicClick = data => {
    const { topicId = '' } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`)
  };

  render() {
    const { keyword } = this.state;
    const { searchTopics, searchUsers, searchThreads } = this.props.search;
    const { pageData: topicsPageData } = searchTopics || {};
    const { pageData: usersPageData } = searchUsers || {};
    const { pageData: threadsPageData } = searchThreads || {};

    return (
      <BaseLayout allowRefresh={false}>
        <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />

        <SidebarPanel
          title="用户" 
          onShowMore={this.redirectToSearchResultUser}
          isLoading={!usersPageData}
          noData={!usersPageData?.length}
          platform='h5'
        >
          {
            usersPageData?.length && <SearchUsers data={usersPageData} onItemClick={this.onUserClick} />
          }
        </SidebarPanel>

        <SidebarPanel
          title="主题" 
          onShowMore={this.redirectToSearchResultPost}
          isLoading={!threadsPageData}
          noData={!threadsPageData?.length}
          platform='h5'
          className={threadsPageData?.length && styles.bottom}
        >
          {
            threadsPageData?.length &&<SearchPosts data={threadsPageData.filter((_, index) => index < 3)} onItemClick={this.onPostClick} />
          }
        </SidebarPanel>

        <SidebarPanel
          title="话题" 
          onShowMore={this.redirectToSearchResultTopic}
          isLoading={!topicsPageData}
          noData={!topicsPageData?.length}
          platform='h5'
        >
          {
            topicsPageData?.length && <SearchTopics data={topicsPageData} onItemClick={this.onTopicClick} />
          }
        </SidebarPanel>
      </BaseLayout>
    );
  }
}

export default withRouter(SearchResultH5Page);
