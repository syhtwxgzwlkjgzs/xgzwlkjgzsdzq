import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import SearchInput from '@components/search-input';
import NoData from '@components/no-data';
import List from '@components/list';
import SearchTopics from './components/search-topics';
import Header from '@components/header';
import { Topic } from '@components/search-result-item';

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

  onTopicClick = data => {
    const { topicId = '' } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`)
  };

  render() {
    const { keyword } = this.state;
    const { topics } = this.props.search;
    const { pageData = [], currentPage, totalPage } = topics || { pageData: [] };

    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.searchInput}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
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
      </div>
    );
  }
}

export default withRouter(SearchResultTopicH5Page);
