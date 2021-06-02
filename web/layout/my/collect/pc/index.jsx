import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import SectionTitle from '@components/section-title';
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import PopTopic from '@components/pop-topic';
import UserCenterFansPc from '@components/user-center/fans-pc';
import SidebarPanel from '@components/sidebar-panel';


@inject('site')
@inject('index')
@observer
class CollectPCPage extends React.Component {
  constructor(props) {
    super(props);
  }

  redirectToSearchResultPost = () => {
    this.props.router.push(`/search/result-post?keyword=${this.state.value || ''}`);
  };

  fetchMoreData = () => {
    const { dispatch } = this.props;
    return dispatch('moreData');
  };

  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => (
    <div className={styles.right}>
      <PopTopic />
      <UserCenterFansPc />
      <Copyright />
    </div>
  );

  render() {
    const { index } = this.props;
    const { pageData, currentPage, totalPage  } = index.threads || {}
    return (
      <div className={styles.container}>
        <BaseLayout
          showRefresh={false}
          noMore={currentPage >= totalPage}
          onRefresh={this.fetchMoreData}
          right={this.renderRight}
        >
          <SidebarPanel 
            title="我的收藏" 
            type='normal'
            isShowMore={false}
            noData={!pageData?.length}
            isLoading={!pageData}
            icon={{ type: 3, name: 'CollectOutlined' }}
            rightText={`共有${this.props.totalCount}条收藏`}
            mold='plane'
          >
            {pageData?.map((item, index) => (
              <ThreadContent className={index === 0 && styles.threadStyle} data={item} key={index} />
            ))}
          </SidebarPanel>
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(CollectPCPage);
