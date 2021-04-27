import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import ActiveUsersMore from '../../../search/pc/components/active-users-more';
import TrendingTopic from '../../../search/pc/components/trending-topics'

@inject('site')
@inject('search')
@observer
class SearchResultUserPcPage extends React.Component {
  redirectToSearchResultTopic = () => {
    this.props.router.push('/search/result-topic');
  };
  onTopicClick = data => console.log('topic click', data);
  onUserClick = data => console.log('user click', data);
  renderRight = () => {
    const { topics } = this.props.search;
    const { pageData = [], currentPage, totalPage } = topics || { pageData: [] };

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
      <div className={styles.searchWrap}>
        <BaseLayout
          left={() => <div></div>}
          right={ this.renderRight }
        >
          { this.renderContent() }
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(SearchResultUserPcPage);
