import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/search-input';
import SearchInput from '@components/search-input';
import SectionTitle from './components/section-title';
import SearchPosts from './components/search-posts';
import SearchTopics from './components/search-topics';
import SearchUsers from './components/search-users';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

@inject('site')
@observer
class SearchResultH5Page extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    const keyword = '';

    this.state = {
      keyword,
    };

    // 进入页面时搜索
    this.searchData(keyword);
  }

  redirectToSearchResultPost = () => {
    // this.props.router.push(`/search/result-post?keyword=${this.state.keyword || ''}`);
    Taro.navigateTo({
      url: `/pages/search/result-post/index?keyword=${this.state.keyword || ''}`
    })
  };

  redirectToSearchResultUser = () => {
    // this.props.router.push(`/search/result-user?keyword=${this.state.keyword || ''}`);
    Taro.navigateTo({
      url: `/pages/search/result-user/index?keyword=${this.state.keyword || ''}`
    })
  };

  redirectToSearchResultTopic = () => {
    Taro.navigateTo({
      url: `/pages/search/result-topic/index?keyword=${this.state.keyword || ''}`
    })
    // this.props.router.push(`/search/result-topic?keyword=${this.state.keyword || ''}`);
  };

  onCancel = () => {
    // this.props.router.back();
    Taro.navigateBack({ delta: 1});
  };

  searchData = keyword => console.log('search', keyword);

  onSearch = (keyword) => {
    // query 更新
    this.props.router.replace(`/search/result?keyword=${keyword}`);
    this.setState({ keyword });
    this.searchData(keyword);
  };

  onUserClick = data => console.log('user click', data);

  onTopicClick = data => console.log('topic click', data);

  onPostClick = data => console.log('post click', data);

  render() {
    const { keyword } = this.state;

    return (
      <View className={styles.page}>
        <View className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </View>
        <View className={styles.section}>
          <SectionTitle title="用户" onShowMore={this.redirectToSearchResultUser} />
        </View>
        <SearchUsers data={SearchUsersData} onItemClick={this.onUserClick} />
        <View className={styles.hr}></View>
        <View className={styles.section}>
          <SectionTitle title="主题" onShowMore={this.redirectToSearchResultPost} />
        </View>
        <SearchPosts data={Array(2).fill('')} onItemClick={this.onPostClick} />
        <View className={styles.hr}></View>
        <View className={styles.section}>
          <SectionTitle title="话题" onShowMore={this.redirectToSearchResultTopic} />
        </View>
        <SearchTopics data={SearchTopicsData} onItemClick={this.onTopicClick} />
      </View>
    );
  }
}
const SearchUsersData = [{ name: 'user1' }, { name: 'user1' }];
const SearchTopicsData = [
  { title: '#dasda#1', content: '#dasda#', hotCount: 2, contentCount: 3 },
  { title: '#dasda#2', content: '#dasda#', hotCount: 2, contentCount: 3 },
];

export default withRouter(SearchResultH5Page);
