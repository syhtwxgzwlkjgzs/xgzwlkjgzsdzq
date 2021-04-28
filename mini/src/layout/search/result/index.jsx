import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/search-input';
import SearchInput from '@components/search-input';
import List from '@components/list';
import SectionTitle from './components/section-title';
import SearchPosts from './components/search-posts';
import SearchTopics from './components/search-topics';
import SearchUsers from './components/search-users';
import NoData from '@components/no-data';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';
import { getCurrentInstance } from '@tarojs/taro';

@inject('site')
@inject('search')
@observer
class SearchResultH5Page extends React.Component {
  constructor(props) {
    super(props);
    const { keyword = '' } = getCurrentInstance().router.params;

    this.state = {
      keyword,
    };

    // 进入页面时搜索
    this.searchData(keyword);
  }

  redirectToSearchResultPost = () => {
    Taro.navigateTo({
      url: `/pages/search/result-post/index?keyword=${this.state.keyword || ''}`
    })
  };

  redirectToSearchResultUser = () => {
    Taro.navigateTo({
      url: `/pages/search/result-user/index?keyword=${this.state.keyword || ''}`
    })
  };

  redirectToSearchResultTopic = () => {
    Taro.navigateTo({
      url: `/pages/search/result-topic/index?keyword=${this.state.keyword || ''}`
    })
  };

  onCancel = () => {
    Taro.navigateBack({ delta: 1});
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
    console.log(threadsPageData, 'usersPageData')
    return (
      <Page>
        <List className={styles.page} allowRefresh={false}>
          <View className={styles.searchInput}>
            <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
          </View>
          <View className={styles.section}>
            <SectionTitle title="用户" onShowMore={this.redirectToSearchResultUser} />
          </View>
          {
            usersPageData?.length
              ? <SearchUsers data={usersPageData} onItemClick={this.onUserClick} />
              : <NoData />
          }

          <View className={styles.hr}></View>
          <View className={styles.section}>
            <SectionTitle title="主题" onShowMore={this.redirectToSearchResultPost} />
          </View>
          {
            threadsPageData?.length
              ? <SearchPosts data={threadsPageData} onItemClick={this.onPostClick} />
              : <NoData />
          }

          <View className={styles.hr}></View>
          <View className={styles.section}>
            <SectionTitle title="话题" onShowMore={this.redirectToSearchResultTopic} />
          </View>
          {
            topicsPageData?.length
              ? <SearchTopics data={topicsPageData} onItemClick={this.onTopicClick} />
              : <NoData />
          }

        </List>
      </Page>
    );
  }
}

export default withRouter(SearchResultH5Page);
