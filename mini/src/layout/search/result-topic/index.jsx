import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '@components/search-input';
import SearchTopics from './components/search-topics';
import NoData from '@components/no-data';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';
import List from '@components/list';
import { Topic } from '@components/search-result-item';

@inject('search')
@observer
class SearchResultTopicH5Page extends React.Component {
  constructor(props) {
    super(props);

    const keyword = '';

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
    return dispatch('moreData', keyword);
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
    const { keyword } = this.state;
    const { topics } = this.props.search;
    const { pageData = [], currentPage, totalPage } = topics || { pageData: [] };

    return (
      <Page>
        <View className={styles.page}>
          <View className={styles.searchInput}>
            <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
          </View>
          {
            pageData?.length
              ? (
                <List
                  className={styles.list}
                  onRefresh={this.fetchMoreData}
                  noMore={currentPage >= totalPage}
                >
                  {
                    pageData?.map((item, index) => (
                      <Topic key={index} data={item} onClick={this.onTopicClick} />
                    ))
                  }
                </List>
              )
              : <NoData />
          }
        </View>
        </Page>
    );
  }
}

export default withRouter(SearchResultTopicH5Page);
