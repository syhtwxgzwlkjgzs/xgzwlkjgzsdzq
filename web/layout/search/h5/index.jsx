import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import SearchInput from '@components/search-input';
import TrendingTopics from './components/trending-topics';
import ActiveUsers from './components/active-users';
import PopularContents from './components/popular-contents';
import SectionTitle from '@components/section-title'
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import '@discuzq/design/dist/styles/index.scss';
import SidebarPanel from '@components/sidebar-panel';
import NoData from '@components/no-data';


@inject('site')
@inject('search')
@observer
class SearchH5Page extends React.Component {
  onSearch = (keyword) => {
    this.props.router.push(`/search/result?keyword=${keyword || ''}`);
  };

  redirectToSearchResultPost = () => {
    this.props.router.push('/search/result-post');
  };

  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  };

  redirectToSearchResultTopic = () => {
    this.props.router.push('/search/result-topic');
  };
  onUserClick = data => console.log('user click', data);

  // 跳转话题详情
  onTopicClick = data => {
    const { topicId = '' } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`)
  };

  onPostClick = data => console.log('post click', data);

  onCancel = () => {
    this.props.router.back();
  };

  render() {
    const { indexTopics, indexUsers, indexThreads } = this.props.search;
    const { pageData: topicsPageData } = indexTopics || {};
    const { pageData: usersPageData } = indexUsers || {};
    const { pageData: threadsPageData } = indexThreads || {};

    return (
      <BaseLayout allowRefresh={false} curr='search' showTabBar>
        <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
        <SidebarPanel
          icon={{ type: 1, name: 'StrongSharpOutlined' }} 
          title="潮流话题" 
          onShowMore={this.redirectToSearchResultTopic}
          isLoading={!topicsPageData}
          noData={topicsPageData?.length}
          platform='h5'
        >
          {
            topicsPageData?.length && <TrendingTopics data={topicsPageData} onItemClick={this.onTopicClick} />
          }
        </SidebarPanel>

        <SidebarPanel
          icon={{ type: 2, name: 'MemberOutlined' }}
          title="活跃用户" 
          onShowMore={this.redirectToSearchResultUser}
          isLoading={!usersPageData}
          noData={usersPageData?.length}
          platform='h5'
        >
          {
            usersPageData?.length && <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
          }
        </SidebarPanel>

        <div className={`${styles.section} ${styles.popularContents}`}>
          <SectionTitle icon={{ type: 3, name: 'HotOutlined' }} title="热门内容" onShowMore={this.redirectToSearchResultPost} />
        </div>
        {
          threadsPageData?.length
            ? <PopularContents data={threadsPageData} />
            : <NoData />
        }
      </BaseLayout>
    );
  }
}

export default withRouter(SearchH5Page);
