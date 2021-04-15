import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '.././../../../components/search-input';
import SearchPosts from './components/search-posts';

import styles from './index.module.scss';

@inject('site')
@observer
class SearchResultPostH5Page extends React.Component {
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

  onPostClick = data => console.log('post click', data);

  render() {
    const { keyword } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        <SearchPosts data={Array(2).fill('')} onItemClick={this.onPostClick} />
      </div>
    );
  }
}

export default withRouter(SearchResultPostH5Page);
