import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/search-input';
import SearchInput from '.././../../components/search-input';
import SectionTitle from './components/section-title';
import SearchPosts from './components/search-posts';
import SearchTopics from './components/search-topics';
import SearchUsers from './components/search-users';

import styles from './index.module.scss';

@inject('site')
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
    this.props.router.push(`/search-result-post?keyword=${this.state.keyword || ''}`);
  };

  redirectToSearchResultUser = () => {
    this.props.router.push(`/search-result-user?keyword=${this.state.keyword || ''}`);
  };

  redirectToSearchResultTopic = () => {
    this.props.router.push(`/search-result-topic?keyword=${this.state.keyword || ''}`);
  };

  onCancel = () => {
    this.props.router.back();
  };

  searchData = keyword => console.log('search', keyword);

  onSearch = (keyword) => {
    // query 更新
    this.props.router.replace(`/search-result?keyword=${keyword}`);
    this.setState({ keyword });
    this.searchData(keyword);
  };

  onUserClick = data => console.log('user click', data);

  onTopicClick = data => console.log('topic click', data);

  onPostClick = data => console.log('post click', data);

  render() {
    const { keyword } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        <div className={styles.section}>
          <SectionTitle title="用户" onShowMore={this.redirectToSearchResultUser} />
          <SearchUsers data={SearchUsersData} onItemClick={this.onUserClick} />
        </div>
        <div className={styles.hr}></div>
        <div className={`${styles.section} ${styles.searchPosts}`}>
          <SectionTitle title="主题" onShowMore={this.redirectToSearchResultPost} />
        </div>
        <SearchPosts data={Array(2).fill('')} onItemClick={this.onPostClick} />
        <div className={styles.hr}></div>
        <div className={`${styles.section} ${styles.searchTopics}`}>
          <SectionTitle title="话题" onShowMore={this.redirectToSearchResultTopic} />
        </div>
        <SearchTopics data={SearchTopicsData} onItemClick={this.onTopicClick} />
      </div>
    );
  }
}
const SearchUsersData = ['user1', 'user2'];
const SearchTopicsData = [
  { title: '#dasda#1', content: '#dasda#', hotCount: 2, contentCount: 3 },
  { title: '#dasda#2', content: '#dasda#', hotCount: 2, contentCount: 3 },
];

export default withRouter(SearchResultH5Page);
