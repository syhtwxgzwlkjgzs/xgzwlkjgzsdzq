import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import SearchInput from '@components/search-input';
import BaseLayout from '@components/base-layout';
import TopicItem from '@components/topic-item'
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
    const { topics, topicsError } = this.props.search;
    const { pageData = [], currentPage, totalPage } = topics || { pageData: [] };

    return (
        <BaseLayout
          onRefresh={this.fetchMoreData}
          noMore={currentPage >= totalPage}
          requestError={topicsError.isError}
          errorText={topicsError.errorText}
        >
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} searchWhileTyping/>
          <div className={styles.wrapper}>
            {
              pageData?.map((item, index) => (
                <TopicItem key={index} data={item} onClick={this.onTopicClick} />
              ))
            }
          </div>
        </BaseLayout>
    );
  }
}

export default withRouter(SearchResultTopicH5Page);
