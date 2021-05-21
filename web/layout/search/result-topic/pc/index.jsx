import React from 'react';
import { inject, observer } from 'mobx-react';
import BaseLayout from '@components/base-layout';
import TrendingTopicMore from '../../../search/pc/components/trending-topic-more';
import ActiveUsers from '@components/active-users'
import { withRouter } from 'next/router';
import Copyright from '@components/copyright';
import SidebarPanel from '@components/sidebar-panel';
import TopicItem from '@components/topic-item'
import styles from './index.module.scss';


@inject('site')
@inject('search')
@observer
class SearchResultTopicPCPage extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

    this.state = {
      keyword,
      refreshing: false,
    };
  }
  
  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  };

  onTopicClick = data => {
    const { topicId } = data
    this.props.router.push(`/topic/topic-detail/${topicId}`);
  };

  fetchMoreData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    return dispatch('moreData', keyword);
  };

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (value) => {
    this.setState({ keyword: value }, () => {
      this.searchData(value);
    });
  }

  renderRight = () => {
    return (
      <>
        <ActiveUsers />
        <Copyright/>
      </>
    )
  }

  renderContent = (pageData) => {
    return (
      <SidebarPanel 
        title="潮流话题" 
        type='normal'
        isShowMore={!pageData}
        noData={!pageData?.length}
        icon={{ type: 1, name: 'StrongSharpOutlined' }}
      >
        <div className={styles.topic}>
          {pageData?.map((item, index) => (
            <TopicItem data={item} key={index} onClick={this.onTopicClick} />  
          ))}
        </div>
        
      </SidebarPanel>
    )
  }

  render() {
    const { pageData, currentPage, totalPage } = this.props.search.topics || {};
    return (
      <BaseLayout
        noMore={currentPage >= totalPage} 
        onRefresh={this.fetchMoreData} 
        showRefresh={false}
        onSearch={this.onSearch}
        right={ this.renderRight }
      >
        { this.renderContent(pageData) }
      </BaseLayout>
    );
  }
}

export default withRouter(SearchResultTopicPCPage);
