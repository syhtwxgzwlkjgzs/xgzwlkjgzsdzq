import React from 'react';
import { inject, observer } from 'mobx-react';
import SearchInput from '@components/search-input';
import ThreadContent from '@components/thread';
import BaseLayout from '@components/base-layout';
import styles from './index.module.scss';
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro';

@inject('site')
@inject('search')
@observer
class SearchResultPostH5Page extends React.Component {
  constructor(props) {
    super(props);

    const { keyword = '' } = getCurrentInstance().router.params;

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
    Taro.navigateBack()
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
      <BaseLayout
          onRefresh={this.fetchMoreData}
          noMore={currentPage >= totalPage}
          showHeader={false}
      >
        <View className={styles.topBox}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} isShowBottom={false} />
        </View>
        {
          pageData?.map((item, index) => (
            <ThreadContent key={index} data={item} />
          ))
        }
      </BaseLayout>
    );
  }
}

export default SearchResultPostH5Page;
