import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
// import SectionTitle from '../../../search/h5/components/section-title'
import SectionTitle from '@components/section-title';
import ActiveUsersMore from '../../../search/pc/components/active-users-more';
import TrendingTopic from '../../../search/pc/components/trending-topics'
import List from '@components/list';
import Copyright from '@components/copyright';
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
  onTopicClick = data => console.log('topic click', data);
  onUserClick = data => console.log('user click', data);

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
    const { pageData = [] } = this.props.search.topics || { pageData: [] };
    return (
      <div className={styles.searchRight}>
        <div className={styles.section}>
          <SectionTitle title="潮流话题" onShowMore={this.redirectToSearchResultTopic}/>
          <TrendingTopic data={pageData} onItemClick={this.onTopicClick}/>
        </div>
        <Copyright/>
      </div>
    )
  }
  renderContent = () => {
    const { users } = this.props.search;
    const { pageData = [] } = users || { pageData: [] };
    return (
      <div className={styles.searchContent}>
        <div className={styles.section}>
          <SectionTitle
            title="活跃用户"
            isShowMore={false}
            icon={{ type: 2, name: 'MemberOutlined' }}
          />
          <ActiveUsersMore data={pageData} onFollow={this.onFollow} onItemClick={this.onUserClick}/>
        </div>
      </div>
    )
  }

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (value) => {
    this.setState({ keyword: value }, () => {
      this.searchData(value);
    });
  }

  render() {
    // const { keyword } = this.state;
    const { users } = this.props.search;
    const { pageData = [], currentPage, totalPage } = users || { pageData: [] };

    return (
      <List className={styles.searchWrap} noMore={currentPage >= totalPage} onRefresh={this.fetchMoreData}>
        <BaseLayout
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent() }
        </BaseLayout>
      </List>
    );
  }
}

export default withRouter(SearchResultUserPcPage);
