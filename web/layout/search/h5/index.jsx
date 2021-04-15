import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/search-input';
import SearchInput from '.././../../components/search-input';
import SectionTitle from './components/section-title';
import TrendingTopics from './components/trending-topics';
import ActiveUsers from './components/active-users';
import PopularContents from './components/popular-contents';

import styles from './index.module.scss';
import '@discuzq/design/dist/styles/index.scss';

@inject('site')
@observer
class SearchH5Page extends React.Component {
  onSearch = () => {
    this.props.router.push('/search-result');
  };

  redirectToSearchResultPost = () => {
    this.props.router.push('/search-result-post');
  };

  redirectToSearchResultUser = () => {
    this.props.router.push('/search-result-user');
  };

  redirectToSearchResultTopic = () => {
    this.props.router.push('/search-result-topic');
  };

  onCancel = () => {
    this.props.router.back();
  };

  render() {
    return (
      <div className={styles.page}>
        <div className={styles.section}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
          <SectionTitle title="潮流话题" onShowMore={this.redirectToSearchResultTopic} />
          <TrendingTopics data={TrendingTopicsData} />
        </div>
        <div className={styles.hr} />
        <div className={styles.section}>
          <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser} />
          <ActiveUsers data={ActiveUsersData} />
        </div>
        <div className={styles.hr} />
        <div className={styles.section}>
          <SectionTitle title="热门内容" onShowMore={this.redirectToSearchResultPost} />
        </div>
        <PopularContents data={Array(1).fill('')} />
      </div>
    );
  }
}

const TrendingTopicsData = Array(5).fill('#pc端功能建议#')
  .concat(Array(5).fill('#pc端功能建议pc端功能建议#'));
const ActiveUsersData = Array(5)
  .fill({ name: '123321' })
  .concat(Array(5).fill({
    name: '321',
    image: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1611688293,2175392062&fm=26&gp=0.jpg',
  }));

export default withRouter(SearchH5Page);
