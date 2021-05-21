import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '@components/section-title'
import TrendingTopicMore from './components/trending-topic-more';
import ThreadContent from '@components/thread';
import ActiveUsersMore from './components/active-users-more';
import Stepper from './components/stepper';
import goToLoginPage from '@common/utils/go-to-login-page';
import Copyright from '@components/copyright';
import SidebarPanel from '@components/sidebar-panel';
import { Toast, Spin } from '@discuzq/design';
import TopicItem from '@components/topic-item'

@inject('site')
@inject('search')
@inject('user')
@observer
class SearchPCPage extends React.Component {
  constructor(props) {
    super(props);
    
    const keyword = this.props.router.query.keyword || '';
    this.state = {
      value: keyword,
      stepIndex: 0
    };
    this.activeUsersRef = React.createRef();
    this.hotTopicRef = React.createRef();
  }

  redirectToSearchResultPost = () => {
    this.props.router.push(`/search/result-post?keyword=${this.state.value || ''}`);
  };

  redirectToSearchResultUser = () => {
    this.props.router.push(`/search/result-user?keyword=${this.state.value || ''}`);
  };

  redirectToSearchResultTopic = () => {
    this.props.router.push(`/search/result-topic?keyword=${this.state.value || ''}`);
  };

  // TODO 处理用户是自己的数据
  onUserClick = ({ userId } = {}) => {
    this.props.router.push(`/my/others?isOtherPerson=true&otherId=${userId}`);
  };

  onTopicClick = data => {
    const { topicId } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`);
  };

  onPostClick = data => console.log('post click', data);

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (value) => {
    this.props.router.replace(`/search?keyword=${value}`);
    this.setState({ keyword: value }, () => {
      this.searchData(value);
    });
  }

  onFollow = ({ id, type }) => {
    if (!this.props.user.isLogin()) {
      Toast.info({ content: '请先登录!' });
      goToLoginPage({ url: '/user/login' });
      return;
    }
    if (type === '1') {
      this.props.search.postFollow(id).then(result => {
        if (result) {
          this.props.search.updateActiveUserInfo(id, { isFollow: true })
        }
      })
    } else {
      this.props.search.cancelFollow({ id, type: 1 }).then(result => {
        if (result) {
          this.props.search.updateActiveUserInfo(id, { isFollow: false })
        }
      })
    }
  }
  itemClick = (index, idName) => {
    const stepIndex = this.state.stepIndex;
    if (stepIndex !== index) {
      this.scrollToAnchor(idName);
      setTimeout(() => {
        this.setState({stepIndex: index});
      }, 1000); // 等待完成 scrollIntoView();
    }
  }
  scrollToAnchor = (anchorName) => {
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if(anchorElement) { anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'}); }
    }
  }
  // 右侧 - 步骤条
  renderRight = () => {
    return (
      <div className={styles.searchRight}>
        <Stepper onItemClick={this.itemClick} selectIndex={this.state.stepIndex}/>
        <Copyright/>
      </div>
    )
  }
  handleScroll = ({ scrollTop } = {}) => {
    const activeUsersPos = this.activeUsersRef.current.offsetTop;
    const hotTopicPos = this.hotTopicRef.current.offsetTop;

    if(scrollTop < activeUsersPos) {
      this.setState({stepIndex: 0}); // TODO: 暂时写死index，应该通过steps传回index
    } else if(scrollTop < hotTopicPos && scrollTop >= activeUsersPos) {
      this.setState({stepIndex: 1});
    } else if(scrollTop >= hotTopicPos) {
      this.setState({stepIndex: 2});
    }
  }

  // 中间 -- 潮流话题 活跃用户 热门内容
  renderContent = () => {

    const { indexTopics, indexUsers, indexThreads } = this.props.search;
    const userId = this.props.user?.userInfo?.id

    const { pageData: topicsPageData } = indexTopics || {};
    const { pageData: usersPageData } = indexUsers || {};
    const { pageData: threadsPageData } = indexThreads || {};

    // TODO 添加活跃用户和当前用户是同一人的判断
    return (
      <div className={styles.searchContent}>
        <div id="StrongSharpOutlined">
          <SidebarPanel 
            title="潮流话题" 
            type='normal'
            isLoading={!topicsPageData}
            noData={!topicsPageData?.length}
            onShowMore={this.redirectToSearchResultTopic}
            icon={{ type: 1, name: 'StrongSharpOutlined' }}
          >
            <div className={styles.topic}>
              {topicsPageData?.map((item, index) => (
                <TopicItem data={item} key={index} onClick={this.onTopicClick} />  
              ))}
            </div>
          </SidebarPanel>
        </div>

        <div id="MemberOutlined" ref={this.activeUsersRef}>
          <SidebarPanel 
            title="活跃用户" 
            type='normal'
            isLoading={!usersPageData}
            noData={!usersPageData?.length}
            onShowMore={this.redirectToSearchResultUser}
            icon={{ type: 2, name: 'MemberOutlined' }}
          >
            <ActiveUsersMore data={usersPageData} onItemClick={this.onUserClick} onFollow={this.onFollow} userId={userId} />
          </SidebarPanel>
        </div>

        <div id="HotOutlined" ref={this.hotTopicRef}>
          <div className={styles.postTitle}>
            <SectionTitle
              title="热门内容"
              icon={{ type: 3, name: 'HotOutlined' }}
              onShowMore={this.redirectToSearchResultPost}
            />
          </div>
          <div className={styles.postContent}>
            {
              threadsPageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />) || <LoadingView />
            }
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
        <BaseLayout
          allowRefresh={false}
          onSearch={this.onSearch}
          right={ this.renderRight }
          onScroll={ this.handleScroll }
        >
          { this.renderContent() }
        </BaseLayout>
    );
  }
}

const LoadingView = () => {
  return (
    <div className={styles.loading}>
      <Spin type="spinner" />
    </div>
  )
}

export default withRouter(SearchPCPage);
