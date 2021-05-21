import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import SectionTitle from '@components/section-title';
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import TrendingTopic from '@layout/search/pc/components/trending-topics';
import SidebarPanel from '@components/sidebar-panel';

@inject('site')
@inject('index')
@inject('search')
@observer
class LikePCPage extends React.Component {
  constructor(props) {
    super(props);
  }

  redirectToSearchResultTopic = () => {
    this.props.router.push('/search/result-topic');
  };

  fetchMoreData = () => {
    const { dispatch } = this.props;
    return dispatch('moreData');
  };
  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => {
    console.log(this.props);
    const { pageData = [] } = this.props.search.topics || { pageData: [] };
    return (
      <>
        <SidebarPanel
          title="潮流话题"
          noData={pageData.length}
          onShowMore={this.redirectToSearchResultTopic}
        >
          <TrendingTopic data={pageData} onItemClick={this.onTopicClick}/>
        </SidebarPanel>
        <SidebarPanel
          title="粉丝"
          leftNum="2880"
          noData={pageData.length}
          onShowMore={this.redirectToSearchResultTopic}
        >
          <TrendingTopic data={pageData} onItemClick={this.onTopicClick}/>
        </SidebarPanel>
        <Copyright/>
      </>
    );
  }
  render() {
    const { index, site } = this.props;
    const { threads } = index;
    const { pageData, currentPage, totalPage, totalCount } = threads || {};
    return (
      <BaseLayout
        right={ this.renderRight }
        noMore={currentPage >= totalPage}
        showRefresh={false}
        onRefresh={this.fetchMoreData}
      >
        <SidebarPanel
          title="我的点赞"
          type='normal'
          isShowMore={false}
          noData={!pageData?.length}
          icon={{ type: 3, name: 'LikeOutlined' }}
          rightText={`共有${totalCount}条点赞`}
          className={styles.container}
        >
          {
            pageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />)
          }
        </SidebarPanel>
      </BaseLayout>
    );
  }
}

export default withRouter(LikePCPage);
