import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '.././../../../components/search-input';
import SearchTopics from './components/search-topics';

import styles from './index.module.scss';

@inject('site')
@observer
class SearchResultTopicH5Page extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

    this.state = {
      keyword,
    };

    // 进入页面时搜索
    this.searchData(keyword);
  }

  onCancel = () => {
    this.props.router.back();
  };

  searchData = keyword => console.log('search', keyword);

  onSearch = (keyword) => {
    this.setState({ keyword });
    this.searchData(keyword);
  };

  onTopicClick = data => console.log('topic click', data);

  render() {
    const { keyword } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        <SearchTopics data={SearchTopicsData} onItemClick={this.onTopicClick} />
      </div>
    );
  }
}

const SearchTopicsData = [
  { title: '#dasda#1', content: '#dasda#', hotCount: 2, contentCount: 3 },
  { title: '#dasda#2', content: '#dasda#', hotCount: 2, contentCount: 3 },
];


export default withRouter(SearchResultTopicH5Page);
