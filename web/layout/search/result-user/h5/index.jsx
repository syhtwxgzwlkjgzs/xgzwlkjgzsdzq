import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '@components/search-input';
import NoData from '@components/no-data';
import SearchUsers from './components/search-users';
import Header from '@components/header';

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
      refreshing: false,
    };
  }

  // data
  refreshData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    dispatch('refresh', keyword);
  };

  fetchMoreData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    dispatch('moreData', keyword);
  };

  // event
  onCancel = () => {
    this.props.router.back();
  };

  onSearch = (keyword) => {
    this.setState({ keyword }, () => {
      this.refreshData();
    });
  };

  onUserClick = data => console.log('user click', data);

  render() {
    const { keyword, refreshing } = this.state;
    const { users } = this.props.search;
    const { pageData } = users || { pageData: [] };
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        {
          pageData && pageData.length
            ? <SearchUsers
                data={pageData}
                refreshing={refreshing}
                onRefresh={this.refreshData}
                onFetchMore={this.fetchMoreData}
                onItemClick={this.onUserClick}
              />
            : <NoData />
        }
      </div>
    );
  }
}

export default withRouter(SearchResultUserH5Page);
