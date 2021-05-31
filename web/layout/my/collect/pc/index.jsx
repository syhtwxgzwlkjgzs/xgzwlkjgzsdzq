import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import SectionTitle from '@components/section-title';
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
// import data from './data';

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
      <Copyright />
    </div>
  );

  // 中间 -- 我的收藏
  renderContent = (data) => {
    const { threads } = data;
    const { pageData } = threads || {};
    return (
      <div className={styles.content}>
        <div className={styles.title}>
          <SectionTitle
            title="我的收藏"
            icon={{ type: 3, name: 'CollectOutlined' }}
            isShowMore={false}
            rightText={`共有${this.props.totalCount}条收藏`}
          />
        </div>
        {pageData?.map((item, index) => (
          <ThreadContent className={styles.threadContent} data={item} key={index} />
        ))}
      </div>
    );
  };

  render() {
    const { index, page, totalPage } = this.props;
    return (
      <div className={styles.container}>
        <BaseLayout
          showRefresh={false}
          noMore={page > totalPage}
          onRefresh={this.fetchMoreData}
          right={this.renderRight}
        >
          {this.renderContent(index)}
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(CollectPCPage);
