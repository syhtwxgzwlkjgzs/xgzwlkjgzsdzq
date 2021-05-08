import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import SectionTitle from '@components/section-title'
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
// import data from './data';

@inject('site')
@inject('index')
@observer
class BuyPCPage extends React.Component {
  constructor(props) {
    super(props);
  }

  redirectToSearchResultPost = () => {
    this.props.router.push(`/search/result-post?keyword=${this.state.value || ''}`);
  };
  // 头部搜索
  onSearch = (value) => {
    this.props.router.replace(`/search?keyword=${value}`);
  }
  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => {
    return (
      <div className={styles.right}>
        <Copyright/>
      </div>
    )
  }
  // 中间 -- 我的购买
  renderContent = (data) => {
    const num = 8;
    const { threads } = data;
    const { pageData } = threads || {};
    return (
      <div className={styles.content}>
        <div className={styles.title}>
          <SectionTitle
            title="我的购买"
            icon={{ type: 3, name: 'ShoppingCartOutlined' }}
            isShowMore={false}
            rightText={`共有${num}条购买`}
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

export default withRouter(BuyPCPage);
