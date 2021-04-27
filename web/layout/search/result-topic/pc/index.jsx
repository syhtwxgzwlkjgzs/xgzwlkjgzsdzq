import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import TrendingTopicMore from '../../../search/pc/components/trending-topic-more';
import ActiveUsers from '../../../search/pc/components/active-users'
import { withRouter } from 'next/router';
import List from '@components/list'
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
  onTopicClick = data => console.log('topic click', data);

  fetchMoreData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    return dispatch('moreData', keyword);
  };

  renderRight = () => {
    const { pageData = [] } = this.props.search.indexUsers || { pageData: [] };
    return (
      <>
      {
        pageData?.length > 0 && (
          <div className={styles.searchRight}>
            <div className={styles.section}>
              <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser}/>
              <ActiveUsers data={pageData} onItemClick={this.onUserClick}/>
            </div>
          </div>
        )
      }
      </>
    )
  }
  renderContent = () => {
    const { pageData = [] } = this.props.search.topics || { pageData: [] };
    return (
      <div className={styles.searchContent}>
        <div className={styles.section}>
          <SectionTitle title="潮流话题" isShowMore={false}/>
          <TrendingTopicMore data={pageData} onItemClick={this.onTopicClick}/>
        </div>
      </div>
    )
  }
  render() {
    const { currentPage, totalPage } = this.props.search.topics || { pageData: [] };
    return (
      <List className={styles.searchWrap} noMore={currentPage === totalPage} onRefresh={this.fetchMoreData}>
        <BaseLayout
          left={() => <div></div>}
          right={ this.renderRight }
        >
          { this.renderContent }
        </BaseLayout>
      </List>
    );
  }
}

export default withRouter(SearchResultTopicPCPage);
