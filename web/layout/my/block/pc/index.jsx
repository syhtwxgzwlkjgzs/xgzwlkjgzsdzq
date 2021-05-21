import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import SectionTitle from '@components/section-title'
import BaseLayout from '@components/base-layout';
import Users from '@layout/search/h5/components/active-users';
import Copyright from '@components/copyright';
import ShieldList from './components/shield-list'

@inject('site')
@inject('search')
@observer
class LikePCPage extends React.Component {
  constructor(props) {
    super(props);
  }

  redirectToSearchResultPost = () => {
    this.props.router.push(`/search/result-post?keyword=${this.state.value || ''}`);
  };

  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => {
    const { search } = this.props;
    const { pageData = [], currentPage, totalPage } = search.users;
    return (
      <div className={styles.right}>
        <div className={styles.section}>
          <SectionTitle
            title="用户"
            isShowMore={false}
          />
          <Users data={pageData?.slice(0, 5)}/>
        </div>
        <Copyright/>
      </div>
    )
  }
  // 中间 -- 我的屏蔽
  renderContent = (data) => {
    const num = 8;
    const { search } = this.props;
    const { pageData = [], currentPage, totalPage } = search.users;
    return (
      <div className={styles.content}>
        <div className={styles.section}>
          <SectionTitle
            title="我的屏蔽"
            icon={{ type: 3, name: 'LikeOutlined' }}
            isShowMore={false}
            rightText={`共有${num}位用户`}
          />
          <ShieldList data={pageData}/>
        </div>
      </div>
    )
  }
  render() {
    const { index, site } = this.props;
    return (
      <div className={styles.container}>
        <BaseLayout
          right={ this.renderRight }
        >
          { this.renderContent(index) }
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(LikePCPage);
