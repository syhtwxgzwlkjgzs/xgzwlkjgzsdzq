import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '@components/search-input';
import SearchUsers from './components/search-users';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';

@inject('site')
@inject('search')
@observer
class SearchResultUserH5Page extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    const keyword = '';

    this.state = {
      data: getData(15, keyword),
      keyword,
      refreshing: false,
    };
  }

  // data
  refreshData = () => {
    const { keyword } = this.state;

    this.setState((prevState) => {
      if (prevState.refreshing) {
        return prevState;
      }
      setTimeout(() => {
        this.setState({
          data: getData(15, keyword),
          refreshing: false,
        });
      }, 1000);
      return { refreshing: true };
    });
  };

  fetchMoreData = () => {
    const { keyword } = this.state;
    setTimeout(() => {
      this.setState(({ data }) => ({
        data: data.concat(getData(15, keyword, data.length)),
      }));
    }, 1000);
  };

  // event
  onCancel = () => {
    this.props.router.back();
  };

  onSearch = (keyword) => {
    this.setState({ keyword });
    this.refreshData(keyword);
  };

  onUserClick = data => console.log('user click', data);

  render() {
    const { keyword, refreshing } = this.state;
    const { users } = this.props.search;
    const { pageData } = users || { pageData: [] };
    return (
    <Page>
      <View className={styles.page}>
        <View className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </View>
        <SearchUsers
          data={pageData}
          refreshing={refreshing}
          onRefresh={this.refreshData}
          onFetchMore={this.fetchMoreData}
          onItemClick={this.onUserClick}
        />
      </View>
    </Page>
    );
  }
}

const getData = () => [];

export default withRouter(SearchResultUserH5Page);
