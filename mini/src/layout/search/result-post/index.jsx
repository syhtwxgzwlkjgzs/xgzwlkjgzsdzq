import React from 'react';
import { inject, observer } from 'mobx-react';
import NoData from '@components/no-data';
import SearchInput from '@components/search-input';
import List from '@components/list';
import ThreadContent from '@components/thread';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';
import styles from './index.module.scss';

@inject('site')
@inject('search')
@observer
class SearchResultPostPage extends React.Component {
  constructor(props) {
    super(props);

    // const keyword = this.props.router.query.keyword || '';
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

  onPostClick = (data) => {};

  render() {
    const { keyword } = this.state;
    const { threads } = this.props.search;
    const { pageData, currentPage, totalPage } = threads || { pageData: [] };
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
                      <ThreadContent className={styles.listItem} key={index} data={item} />
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

export default SearchResultPostPage;
