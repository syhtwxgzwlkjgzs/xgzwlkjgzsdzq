import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import TrendingTopicMore from '../../../search/pc/components/trending-topic-more';
import ActiveUsers from '../../../search/pc/components/active-users'
import { withRouter } from 'next/router';
import List from '@components/list';
import Copyright from '@components/copyright';
@inject('site')
@inject('search')
@observer
class SearchResultTopicPCPage extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

    this.state = {
      keyword,
      refreshing: false,
    };
  }
  
  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  };

  onTopicClick = data => {
    const { topicId } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`);
  };

  fetchMoreData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    return dispatch('moreData', keyword);
  };

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (value) => {
    this.setState({ keyword: value }, () => {
      this.searchData(value);
    });
  }

  renderRight = () => {
    const { pageData = [] } = this.props.search.indexUsers || { pageData: [] };
    return (
      <div className={styles.searchRight}>
        <div className={styles.section}>
          <SectionTitle
            title="活跃用户"
            onShowMore={this.redirectToSearchResultUser}
          />
          <ActiveUsers data={pageData} onItemClick={this.onUserClick}/>
        </div>
        <Copyright/>
      </div>
    )
  }
  renderContent = () => {
    const { pageData = [] } = this.props.search.topics || { pageData: [] };
    return (
      <div className={styles.searchContent}>
        <div className={styles.section}>
          <SectionTitle
            title="潮流话题"
            isShowMore={false}
            icon={{ type: 1, name: 'StrongSharpOutlined' }}
          />
          <TrendingTopicMore data={pageData} onItemClick={this.onTopicClick}/>
        </div>
      </div>
    )
  }
  render() {
    const { currentPage, totalPage } = this.props.search.topics || { pageData: [] };
    return (
      <List className={styles.searchWrap} noMore={currentPage >= totalPage} onRefresh={this.fetchMoreData}>
        <BaseLayout
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent }
        </BaseLayout>
      </List>
    );
  }
}

export default withRouter(SearchResultTopicPCPage);
