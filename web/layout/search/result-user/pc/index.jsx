import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import BaseLayout from '@components/base-layout';
import ActiveUsersMore from '../../../search/pc/components/active-users-more';
import Copyright from '@components/copyright';
import SidebarPanel from '@components/sidebar-panel';
import PopTopic from '@components/pop-topic';

@inject('site')
@inject('user')
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

  onUserClick = ({ userId } = {}) => {
    this.props.router.push(`/user/${userId}`);
  };

  onTopicClick = data => {
    const { topicId } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`);
  };

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

  fetchMoreData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    return dispatch('moreData', keyword);
  };

  renderRight = () => {
    return (
      <>
        <PopTopic />
        <Copyright/>
      </>
    )
  }

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('refresh', keyword);
  };

  onSearch = (value) => {
    this.setState({ keyword: value }, () => {
      this.searchData(value);
    });
  }

  render() {
    // const { keyword } = this.state;
    const { users, usersError } = this.props.search;
    const { pageData, currentPage, totalPage } = users || {};
    const userId = this.props.user?.userInfo?.id

    return (
      <BaseLayout
        onSearch={this.onSearch}
        right={ this.renderRight }
        noMore={currentPage >= totalPage} 
        showRefresh={false}
        onRefresh={this.fetchMoreData}
        isShowLayoutRefresh={!!pageData?.length}
      >
        <SidebarPanel 
          title="活跃用户" 
          type='normal'
          isShowMore={false}
          isLoading={!pageData}
          noData={!pageData?.length}
          icon={{ type: 2, name: 'MemberOutlined' }}
          isError={usersError.isError}
          errorText={usersError.errorText}
        >
          <ActiveUsersMore data={pageData} onFollow={this.onFollow} onItemClick={this.onUserClick} userId={userId} />
        </SidebarPanel>
      </BaseLayout>
    );
  }
}

export default withRouter(SearchResultUserPcPage);
