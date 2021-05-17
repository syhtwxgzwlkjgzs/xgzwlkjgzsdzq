import React from 'react';
import { inject, observer } from 'mobx-react';

import SearchInput from '@components/search-input';
import List from '@components/list';
import SectionTitle from './components/section-title';
import TrendingTopics from './components/trending-topics';
import ActiveUsers from './components/active-users';
import PopularContents from './components/popular-contents';
import NoData from '@components/no-data';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';

@inject('site')
@inject('search')
@observer
class SearchPage extends React.Component {
  state = {
    keyword: ''
  }
  onSearch = (value) => {
    this.setState({ keyword: value })
    Taro.navigateTo({
      url: `/subPages/search/result/index?keyword=${value || ''}`
    })
  };

  redirectToSearchResultPost = () => {
    const { keyword } = this.state
    Taro.navigateTo({
      url: `/subPages/search/result-post/index?keyword=${keyword || ''}`
    })
  };

  redirectToSearchResultUser = () => {
    const { keyword } = this.state
    Taro.navigateTo({
      url: `/subPages/search/result-user/index?keyword=${keyword || ''}`
    })
  };

  redirectToSearchResultTopic = () => {
    const { keyword } = this.state
    Taro.navigateTo({
      url: `/subPages/search/result-topic/index?keyword=${keyword || ''}`
    })
  };
  onUserClick = data => console.log('user click', data);
  onTopicClick = data => {
    Taro.navigateTo({
      url: `/subPages/topic/topic-detail/index?id=${data.topicId || ''}`
    });
  };
  onPostClick = data => console.log('post click', data);

  onCancel = () => {
    // Taro.navigateBack()
  };

  render() {
    const { indexTopics, indexUsers, indexThreads } = this.props.search;
    const { pageData: topicsPageData = [] } = indexTopics || {};
    const { pageData: usersPageData = [] } = indexUsers || {};
    const { pageData: threadsPageData = [] } = indexThreads || {};

    return (
      <List className={styles.page} allowRefresh={false}>
        <View className={styles.section}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
          <SectionTitle icon={{ type: 1, name: 'StrongSharpOutlined' }} title="潮流话题" onShowMore={this.redirectToSearchResultTopic} />
          {
            topicsPageData?.length
              ? <TrendingTopics data={topicsPageData} onItemClick={this.onTopicClick} />
              : <NoData />
          }
        </View>
        <View className={styles.hr} />
        <View className={styles.section}>
          <SectionTitle icon={{ type: 2, name: 'MemberOutlined' }} title="活跃用户" onShowMore={this.redirectToSearchResultUser} />
          {
            usersPageData?.length
              ? <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
              : <NoData />
          }
        </View>
        <View className={styles.hr} />
        <View className={`${styles.section} ${styles.popularContents}`}>
          <SectionTitle icon={{ type: 3, name: 'HotOutlined' }} title="热门内容" onShowMore={this.redirectToSearchResultPost} />
        </View>
        {
          threadsPageData?.length
            ? <PopularContents data={threadsPageData} onItemClick={this.onPostClick} />
            : <NoData />
        }
      </List>
    );
  }
}

export default SearchPage;
