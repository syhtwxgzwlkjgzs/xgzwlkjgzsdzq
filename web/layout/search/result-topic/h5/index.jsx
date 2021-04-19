import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '.././../../../components/search-input';
import SearchTopics from './components/search-topics';

import styles from './index.module.scss';

@inject('search')
@observer
class SearchResultTopicH5Page extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

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
    const { keyword, data, refreshing } = this.state;
    return (
      <div className={styles.page}>
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
        <SearchTopics
          data={data}
          refreshing={refreshing}
          onRefresh={this.refreshData}
          onFetchMore={this.fetchMoreData}
          onItemClick={this.onTopicClick}
        />
      </div>
    );
  }
}

const getData = (number, keyword, prevLen = 0) => Array(number)
  .fill('')
  .map((v, index) => ({
    title: `#test-${prevLen + index + 1}#`,
    content: `#${keyword}#`,
    hotCount: 2,
    contentCount: 3,
  }));

export default withRouter(SearchResultTopicH5Page);
