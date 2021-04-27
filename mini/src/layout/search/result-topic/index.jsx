import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '@components/search-input';
import SearchTopics from './components/search-topics';
import Header from '@components/header';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

@inject('search')
@observer
class SearchResultTopicH5Page extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    console.log(this.props.children, this.props.myText, '111')
    const keyword = '';

    this.state = {
      data: getData(12, keyword),
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
          data: getData(12, keyword),
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
        data: data.concat(getData(12, keyword, data.length)),
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

  onTopicClick = data => console.log('topic click', data);

  render() {
    const { keyword, refreshing } = this.state;
    const { topics } = this.props.search;
    const { pageData } = topics || { pageData: [] };
    return (
      <View className={styles.page}>
        <View className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </View>
        <SearchTopics
          data={pageData}
          refreshing={refreshing}
          onRefresh={this.refreshData}
          onFetchMore={this.fetchMoreData}
          onItemClick={this.onTopicClick}
        />
      </View>
    );
  }
}

const getData = () => [];

export default withRouter(SearchResultTopicH5Page);
