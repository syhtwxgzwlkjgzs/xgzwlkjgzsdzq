import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import ActiveUsersMore from '../../../search/pc/components/active-users-more';
import TrendingTopic from '../../../search/pc/components/trending-topics'
import List from '@components/list'
@inject('site')
@inject('search')
@observer
class SearchResultUserPcPage extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

    this.state = {
      keyword,
    };
  }

  redirectToSearchResultTopic = () => {
    this.props.router.push('/search/result-topic');
  };
  onTopicClick = data => console.log('topic click', data);
  onUserClick = data => console.log('user click', data);

  fetchMoreData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    return dispatch('moreData', keyword);
  };

  renderRight = () => {
    const { pageData = [] } = this.props.search.indexTopics || { pageData: [] };

    return (
      <div className={styles.searchRight}>
        <div className={styles.section}>
          <SectionTitle title="潮流话题" onShowMore={this.redirectToSearchResultTopic}/>
          <TrendingTopic data={pageData} onItemClick={this.onTopicClick}/>
        </div>
      </div>
    )
  }
  renderContent = () => {
    const { users } = this.props.search;
    const { pageData = [], currentPage, totalPage } = users || { pageData: [] };
    return (
      <div className={styles.searchContent}>
        <div className={styles.section}>
          <SectionTitle title="活跃用户" isShowMore={false} />
          <ActiveUsersMore data={pageData} onItemClick={this.onUserClick}/>
        </div>
      </div>
    )
  }
  render() {
    // const { keyword } = this.state;
    const { users } = this.props.search;
    const { pageData = [], currentPage, totalPage } = users || { pageData: [] };

    return (
      <List className={styles.searchWrap} noMore={currentPage === totalPage} onRefresh={this.fetchMoreData}>
        <BaseLayout
          left={() => <div></div>}
          right={ this.renderRight }
        >
          { this.renderContent() }
        </BaseLayout>
      </List>
    );
  }
}

export default withRouter(SearchResultUserPcPage);
