import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import SearchInput from '@components/search-input';
import TrendingTopics from './components/trending-topics';
import ActiveUsers from './components/active-users';
import PopularContents from './components/popular-contents';
import BaseLayout from '@components/base-layout';
import '@discuzq/design/dist/styles/index.scss';
import SidebarPanel from '@components/sidebar-panel';

@inject('site')
@inject('search')
@inject('baselayout')
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

  onUserClick = ({ userId } = {}) => {
    this.props.router.push(`/my/others?isOtherPerson=true&otherId=${userId}`);
  };

  // 跳转话题详情
  onTopicClick = data => {
    const { topicId = '' } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`)
  };

  onPostClick = data => console.log('post click', data);

  onCancel = () => {
    this.props.router.back();
  };

  // 点击底部tabBar
  onClickTabBar = (data, index) => {
    if (index !== 1) {
      return
    }
    this.props.baselayout.setSearch(0);

    const { dispatch = () => {} } = this.props;
    dispatch('refresh', {});
  }

  onScroll = ({ scrollTop }) => {
    this.props.baselayout.setSearch(scrollTop);
  }

  render() {
    const { indexTopics, indexUsers, indexThreads } = this.props.search;
    const { pageData: topicsPageData } = indexTopics || {};
    const { pageData: usersPageData } = indexUsers || {};
    const { pageData: threadsPageData } = indexThreads || {};

    return (
      <BaseLayout allowRefresh={false} curr='search' showTabBar onClickTabBar={this.onClickTabBar} pageName="search" onScroll={this.onScroll}>
        <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} isShowBottom={false} />
        <SidebarPanel
          icon={{ type: 1, name: 'StrongSharpOutlined' }} 
          title="潮流话题" 
          onShowMore={this.redirectToSearchResultTopic}
          isLoading={!topicsPageData}
          noData={!topicsPageData?.length}
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
          noData={!usersPageData?.length}
          platform='h5'
        >
          {
            usersPageData?.length && <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
          }
        </SidebarPanel>

        <SidebarPanel
          icon={{ type: 3, name: 'HotOutlined' }}
          title="热门内容" 
          onShowMore={this.redirectToSearchResultPost}
          isLoading={!threadsPageData}
          noData={!threadsPageData?.length}
          platform='h5'
        >
          {
            threadsPageData?.length && <PopularContents data={threadsPageData} />
          }
        </SidebarPanel>
      </BaseLayout>
    );
  }
}

export default withRouter(SearchH5Page);
