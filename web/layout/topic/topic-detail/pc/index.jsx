import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { withRouter } from 'next/router';
import BaseLayout from '@components/base-layout';
import List from '@components/list'
import NoData from '@components/no-data';
import SectionTitle from '@components/section-title'
import DetailsHeader from './components/details-header';
import ThreadContent from '@components/thread'
import Copyright from '@components/copyright';
@inject('site')
@inject('user')
@inject('topic')
@observer
class IndexPCPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
    };
  }
  onSearch = (value) => {
    this.setState({ keyword: value }, () => {
      // this.searchData(value);
    });
  }
   // 右侧 - 活跃用户 版权信息
   renderRight = () => {
    return (
      <div className={styles.topicRight}>
        <div className={styles.section}>
          <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser}/>
          {/* <ActiveUsers data={pageData} onItemClick={this.onUserClick}/> */}
        </div>
        <Copyright/>
      </div>
    )
  }

  renderItem = ({ content = '', threadCount = 0, viewCount = 0, threads = [] }, index) => {
    return (
      <div className={styles.topicContent} key={index}>
        <DetailsHeader title={content} viewNum={viewCount} contentNum={threadCount} onShare={this.onShare} />
        <div className={styles.themeContent}>
          {
            threads?.length ?
              (
                threads?.map((item, index) => (
                  <ThreadContent data={item} key={index} className={styles.item} />
                ))
              )
              : <NoData />
          }
        </div>
      </div>
    )
  }

  render() {
    const { pageData = [] } = this.props.topic?.topicDetail || {};

    return (
      // <List className={styles.topicWrap}>
      <div className={styles.topicWrap}>
        <BaseLayout
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { 
            pageData?.map((item, index) => this.renderItem(item, index)) || <NoData />
          }
        </BaseLayout>
        </div>
      // </List>
    );
  }
}
export default withRouter(IndexPCPage);
