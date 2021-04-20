import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '@components/search-input';
import NoData from '@components/no-data';
import SearchTopics from './components/search-topics';
import Header from '@components/header';

import styles from './index.module.scss';

@inject('search')
@observer
class SearchResultTopicH5Page extends React.Component {
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

  onTopicClick = data => console.log('topic click', data);

  render() {
    const { keyword, refreshing } = this.state;
    const { topics } = this.props.search;
    const { pageData } = topics || { pageData: [] };

    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        {
          pageData && pageData.length
            ? <SearchTopics
                data={pageData}
                refreshing={refreshing}
                onRefresh={this.refreshData}
                onFetchMore={this.fetchMoreData}
                onItemClick={this.onTopicClick}
              />
            : <NoData />
        }

      </div>
    );
  }
}

export default withRouter(SearchResultTopicH5Page);
