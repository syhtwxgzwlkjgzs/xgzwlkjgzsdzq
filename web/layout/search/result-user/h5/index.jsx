import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '.././../../../components/search-input';
import SearchUsers from './components/search-users';

import styles from './index.module.scss';

@inject('site')
@inject('search')
@observer
class SearchResultUserH5Page extends React.Component {
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

  onUserClick = data => console.log('user click', data);

  render() {
    const { keyword } = this.state;
    const { users } = this.props.search;
    const { pageData } = users || { pageData: [] };

    return (
      <div className={styles.page}>
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        <SearchUsers data={pageData} onItemClick={this.onUserClick} />
      </div>
    );
  }
}

export default withRouter(SearchResultUserH5Page);
