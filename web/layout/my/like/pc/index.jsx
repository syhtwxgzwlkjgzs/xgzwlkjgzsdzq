import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import SectionTitle from '@components/section-title'
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import TrendingTopic from '@layout/search/pc/components/trending-topics'

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
  // 头部搜索
  onSearch = (value) => {
    this.props.router.replace(`/search?keyword=${value}`);
  }
  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => {
    const { pageData = [] } = this.props.search.topics || { pageData: [] };
    return (
      <div className={styles.right}>
        <div className={styles.section}>
          <SectionTitle title="潮流话题" onShowMore={this.redirectToSearchResultTopic}/>
          <TrendingTopic data={pageData} onItemClick={this.onTopicClick}/>
        </div>
        <Copyright/>
      </div>
    )
  }
  // 中间 -- 我的点赞
  renderContent = (data) => {
    const num = 8;
    const { threads } = data;
    const { pageData, totalCount } = threads || {};
    return (
      <div className={styles.content}>
        <div className={styles.title}>
          <SectionTitle
            title="我的点赞"
            icon={{ type: 3, name: 'LikeOutlined' }}
            isShowMore={false}
            rightText={`共有${totalCount}条点赞`}
          />
        </div>
        {
          pageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />)
        }
      </div>
    )
  }
  render() {
    const { index, site } = this.props;
    console.log(index);
    return (
      <div className={styles.container}>
        <BaseLayout
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent(index) }
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(LikePCPage);
