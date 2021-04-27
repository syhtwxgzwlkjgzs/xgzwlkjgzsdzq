import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/search-input';
import SearchInput from '../../components/search-input';
import SectionTitle from './components/section-title';
import TrendingTopics from './components/trending-topics';
import ActiveUsers from './components/active-users';
import PopularContents from './components/popular-contents';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import '@discuzq/design/dist/styles/index.scss';

@inject('site')
@inject('search')
@observer
class SearchH5Page extends React.Component {
  onSearch = (keyword) => {
    Taro.navigateTo({
      url: `result?keyword=${keyword || ''}`
    })
  };

  redirectToSearchResultPost = () => {
    Taro.navigateTo({
      url: '/pages/search/result-post/index'
    })
  };

  redirectToSearchResultUser = () => {
    Taro.navigateTo({
      url: '/pages/search/result-user/index'
    })
  };

  redirectToSearchResultTopic = () => {
    Taro.navigateTo({
      url: '/pages/search/result-topic/index'
    })
  };
  onUserClick = data => console.log('user click', data);
  onTopicClick = data => console.log('topic click', data);
  onPostClick = data => console.log('post click', data);

  onCancel = () => {
    Taro.navigateBack({ delta: 1});
  };

  render() {
    const { indexTopics, indexUsers, indexThreads } = this.props.search;
    const { pageData: topicsPageData = [] } = indexTopics|| {};
    const { pageData: usersPageData = [] } = indexUsers || {};
    const { pageData: threadsPageData = [] } = indexThreads || {};
    return (
      <View className={styles.page}>
        <View className={styles.section}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
          <SectionTitle title="潮流话题" onShowMore={this.redirectToSearchResultTopic} />
          <TrendingTopics data={topicsPageData} onItemClick={this.onTopicClick} />
        </View>
        <View className={styles.hr} />
        <View className={styles.section}>
          <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser} />
          <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
        </View>
        <View className={styles.hr} />
        <View className={`${styles.section} ${styles.popularContents}`}>
          <SectionTitle title="热门内容" onShowMore={this.redirectToSearchResultPost} />
        </View>
        <PopularContents data={threadsPageData} onItemClick={this.onPostClick} />
      </View>
    );
  }
}

export default withRouter(SearchH5Page);
// export default SearchH5Page;
