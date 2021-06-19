import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread';
import goToLoginPage from '@common/utils/go-to-login-page';
import Copyright from '@components/copyright';
import SidebarPanel from '@components/sidebar-panel';
import { Toast } from '@discuzq/design';
import TopicItem from '@components/search/topic-item'
import ActiveUsersMore from '@components/search/active-user-more-items';
import Stepper from '@components/stepper';

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
      stepIndex: 0,
      position: -1,
    };
    this.treadingTopicRef = React.createRef();
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

  onUserClick = ({ userId } = {}) => {
    this.props.router.push(`/user/${userId}`);
  };

  onTopicClick = data => {
    const { topicId } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`);
  };

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (value) => {
    this.props.router.replace(`/search?keyword=${value}`);
    this.setState({ value }, () => {
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
          const { isMutual = 0 } = result
          this.props.search.updateActiveUserInfo(id, { isFollow: true, isMutual: !!isMutual })
        }
      }).catch(err => {
        Toast.info({ content: err });
      })
    } else {
      this.props.search.cancelFollow({ id, type: 1 }).then(result => {
        if (result) {
          this.props.search.updateActiveUserInfo(id, { isFollow: false, isMutual: false })
        }
      })
    }
  }
  itemClick = (index) => {
    const HEADER_HEIGHT = 57;
    const STEPPER_PADDING = 24;
    let pos = -1, scrollTo = -1;

    switch (index) {
      case 0:
        pos = this.treadingTopicRef?.current?.offsetTop || 0;
        break;
      case 1:
        pos = this.activeUsersRef?.current?.offsetTop || 0;
        break;
      case 2:
        pos = this.hotTopicRef?.current?.offsetTop || 0;
        break;
      default:
        return;
    }
    scrollTo = pos + parseInt(HEADER_HEIGHT / 2) - STEPPER_PADDING;

    const stepIndex = this.state.stepIndex;
    if (stepIndex !== index) {
      this.setState({position: scrollTo});
      this.setState({stepIndex: index});
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
    const HEADER_HEIGHT = 57;
    const STEPPER_PADDING = 30;

    const activeUsersPos = this.activeUsersRef?.current?.offsetTop || 0,
          activeUsersScrollTo = activeUsersPos + parseInt(HEADER_HEIGHT / 2) - STEPPER_PADDING;

    const hotTopicPos = this.hotTopicRef?.current?.offsetTop || 0,
          hotTopicScrollTo = hotTopicPos + parseInt(HEADER_HEIGHT / 2) - STEPPER_PADDING;

    if(scrollTop) {
      if(scrollTop < activeUsersScrollTo) {
        this.setState({stepIndex: 0});
      } else if(scrollTop < hotTopicScrollTo && scrollTop >= activeUsersScrollTo) {
        this.setState({stepIndex: 1});
      } else if(scrollTop >= hotTopicScrollTo) {
        this.setState({stepIndex: 2});
      }
    }
  }

  // 中间 -- 潮流话题 活跃用户 热门内容
  renderContent = () => {

    const { indexTopics, indexUsers, indexThreads, indexTopicsError, indexUsersError, indexThreadsError } = this.props.search;
    const userId = this.props.user?.userInfo?.id

    const { pageData: topicsPageData } = indexTopics || {};
    const { pageData: usersPageData } = indexUsers || {};
    const { pageData: threadsPageData } = indexThreads || {};

    return (
      <div className={styles.searchContent}>
        <div ref={this.treadingTopicRef}>
          <SidebarPanel
            title="潮流话题"
            type='normal'
            isLoading={!topicsPageData}
            noData={!topicsPageData?.length}
            onShowMore={this.redirectToSearchResultTopic}
            icon={{ type: 1, name: 'StrongSharpOutlined' }}
            isError={indexTopicsError.isError}
            errorText={indexTopicsError.errorText}
          >
            <div className={styles.topic}>
              {topicsPageData?.map((item, index) => (
                <TopicItem data={item} key={index} onClick={this.onTopicClick} />
              ))}
            </div>
          </SidebarPanel>
        </div>

        <div ref={this.activeUsersRef}>
          <SidebarPanel
            title="活跃用户"
            type='normal'
            isLoading={!usersPageData}
            noData={!usersPageData?.length}
            onShowMore={this.redirectToSearchResultUser}
            icon={{ type: 2, name: 'MemberOutlined' }}
            isError={indexUsersError.isError}
            errorText={indexUsersError.errorText}
          >
            <ActiveUsersMore data={usersPageData} onItemClick={this.onUserClick} onFollow={this.onFollow} userId={userId} />
          </SidebarPanel>
        </div>

        <div ref={this.hotTopicRef}>
          <SidebarPanel
            type='normal'
            isLoading={!threadsPageData}
            noData={!threadsPageData?.length}
            title="热门内容"
            icon={{ type: 3, name: 'HotOutlined' }}
            onShowMore={this.redirectToSearchResultPost}
            mold='plane'
            isError={indexThreadsError.isError}
            errorText={indexThreadsError.errorText}
          >
            {threadsPageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />)}
          </SidebarPanel>
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
          jumpTo={this.state.position}
          pageName="search"
        showRefresh={false}
        className="search-page"
        >
          { this.renderContent() }
        </BaseLayout>
    );
  }
}

export default withRouter(SearchPCPage);
