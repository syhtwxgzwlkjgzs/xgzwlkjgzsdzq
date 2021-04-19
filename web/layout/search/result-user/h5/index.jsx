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
    const { keyword, data, refreshing } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        <SearchUsers
          data={data}
          refreshing={refreshing}
          onRefresh={this.refreshData}
          onFetchMore={this.fetchMoreData}
          onItemClick={this.onUserClick}
        />
      </div>
    );
  }
}

const getData = (number, keyword, prevLen = 0) => Array(number)
  .fill('')
  .map((v, index) => ({
    name: `user-${keyword || ''}-${prevLen + index + 1}`,
    image: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1611688293,2175392062&fm=26&gp=0.jpg',
    group: '测试组',
  }));

export default withRouter(SearchResultUserH5Page);
