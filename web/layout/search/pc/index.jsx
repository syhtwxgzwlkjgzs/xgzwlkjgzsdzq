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
import { Toast } from '@discuzq/design';

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
      this.setState({stepIndex: index});
      this.scrollToAnchor(idName);
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
  // 中间 -- 潮流话题 活跃用户 热门内容
  renderContent = () => {
    const { indexTopics, indexUsers, indexThreads } = this.props.search;

    const { pageData: topicsPageData = [] } = indexTopics || {};
    const { pageData: usersPageData = [] } = indexUsers || {};
    const { pageData: threadsPageData = [] } = indexThreads || {};
    // TODO 添加活跃用户和当前用户是同一人的判断
    return (
      <div className={styles.searchContent}>
        <div className={styles.section} id="StrongSharpOutlined">
          <SectionTitle
            title="潮流话题"
            icon={{ type: 1, name: 'StrongSharpOutlined' }}
            onShowMore={this.redirectToSearchResultTopic}
          />
          <TrendingTopicMore data={topicsPageData} onItemClick={this.onTopicClick}/>
        </div>
        <div className={styles.section} id="MemberOutlined">
          <SectionTitle
            title="活跃用户"
            icon={{ type: 2, name: 'MemberOutlined' }}
            onShowMore={this.redirectToSearchResultUser}
          />
          <ActiveUsersMore data={usersPageData} onItemClick={this.onUserClick} onFollow={this.onFollow} />
        </div>
        <div id="HotOutlined">
          <div className={styles.postTitle}>
            <SectionTitle
              title="热门内容"
              icon={{ type: 3, name: 'HotOutlined' }}
              onShowMore={this.redirectToSearchResultPost}
            />
          </div>
          <div className={styles.postContent}>
            {
              threadsPageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />)
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
        >
          { this.renderContent() }
        </BaseLayout>
    );
  }
}

export default withRouter(SearchPCPage);
