import React from 'react';
import { inject, observer } from 'mobx-react';
import SearchInput from '@components/search-input';
import TrendingTopics from './components/trending-topics';
import ActiveUsers from './components/active-users';
import PopularContents from './components/popular-contents';
import BaseLayout from '@components/base-layout';
import '@discuzq/design/dist/styles/index.scss';
import SidebarPanel from '@components/sidebar-panel';
import Taro from '@tarojs/taro';

@inject('site')
@inject('search')
@observer
class SearchH5Page extends React.Component {
  onSearch = (keyword) => {
    Taro.navigateTo({url: `/subPages/search/result/index?keyword=${keyword || ''}`});
  };

  redirectToSearchResultPost = () => {
    Taro.navigateTo({url: '/subPages/search/result-post/index'});
  };

  redirectToSearchResultUser = () => {
    Taro.navigateTo({url: '/subPages/search/result-user/index'});
  };

  redirectToSearchResultTopic = () => {
    Taro.navigateTo({url: '/subPages/search/result-topic/index'});
  };

  onUserClick = ({ userId } = {}) => {
    Taro.navigateTo({url: `/subPages/user/${userId}`});
  };

  // 跳转话题详情
  onTopicClick = data => {
    const { topicId = '' } = data
    Taro.navigateTo({url: `/subPages/topic/topic-detail/index?id=${topicId}`})
  };

  onPostClick = data => console.log('post click', data);

  onCancel = () => {
    Taro.navigateBack({ delta: 1 })  
  };

  render() {
    const { indexTopics, indexUsers, indexThreads } = this.props.search;
    const { pageData: topicsPageData } = indexTopics || {};
    const { pageData: usersPageData } = indexUsers || {};
    const { pageData: threadsPageData } = indexThreads || {};
    return (
      <BaseLayout showHeader={false} allowRefresh={false} curr='search' showTabBar>
        <SearchInput onSearch={this.onSearch} onCancel={this.onSearch} isShowBottom={false} />
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

export default SearchH5Page;
