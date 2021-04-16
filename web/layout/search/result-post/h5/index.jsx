import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '.././../../../components/search-input';
import SearchPosts from './components/search-posts';

import styles from './index.module.scss';

@inject('site')
@observer
class SearchResultPostH5Page extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

    this.state = {
      data: getData(2),
      keyword,
      refreshing: false,
    };
  }

  // data
  refreshData = () => {
    this.setState((prevState) => {
      if (prevState.refreshing) {
        return prevState;
      }
      setTimeout(() => {
        this.setState(() => ({
          data: getData(2),
          refreshing: false,
        }));
      }, 1000);
      return { refreshing: true };
    });
  };

  fetchMoreData = () => {
    // const { keyword } = this.state;
    setTimeout(() => {
      this.setState(({ data }) => ({
        data: data.concat(getData(2)),
      }));
    }, 1000);
  };

  // event
  onCancel = () => {
    this.props.router.back();
  };

  onSearch = (keyword) => {
    this.setState({ keyword }, () => this.refreshData());
  };

  onPostClick = data => console.log('post click', data);

  render() {
    const { keyword, data, refreshing } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        <SearchPosts
          data={data}
          refreshing={refreshing}
          onRefresh={this.refreshData}
          onFetchMore={this.fetchMoreData}
          onItemClick={this.onPostClick}
        />
      </div>
    );
  }
}

const getData = number => Array(number).fill('');

export default withRouter(SearchResultPostH5Page);
