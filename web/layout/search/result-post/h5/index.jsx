import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import Header from '@components/header';
import NoData from '@components/no-data';
import SearchInput from '@components/search-input';
import SearchPosts from './components/search-posts';

import styles from './index.module.scss';

@inject('site')
@inject('search')
@observer
class SearchResultPostH5Page extends React.Component {
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
    dispatch('more', keyword);
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

  onPostClick = (data) => {
    this.props.router.push('/thread/9060');
  };

  render() {
    const { keyword, refreshing } = this.state;
    const { threads } = this.props.search;
    const { pageData } = threads || { pageData: [] };

    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        {
          pageData && pageData.length
            ? <SearchPosts
                data={pageData}
                refreshing={refreshing}
                onRefresh={this.refreshData}
                onFetchMore={this.fetchMoreData}
                onItemClick={this.onPostClick}
              />
            : <NoData />
        }
      </div>
    );
  }
}

export default withRouter(SearchResultPostH5Page);
