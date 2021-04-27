import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '@components/search-input';
import NoData from '@components/no-data';
import UserItem from '@components/thread/user-item';
import List from '@components/list';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import Page from '@components/page';

@inject('site')
@inject('search')
@observer
class SearchResultUserH5Page extends React.Component {
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

  onUserClick = data => console.log('user click', data);

  render() {
    const { keyword } = this.state;
    const { users } = this.props.search;
    const { pageData = [], currentPage, totalPage } = users || { pageData: [] };

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
                    pageData.map((item, index) => (
                      <UserItem
                        key={index}
                        title={item.username}
                        imgSrc={item.avatar}
                        label={item.groupName}
                        onClick={this.onUserClick}
                      />
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

export default withRouter(SearchResultUserH5Page);
