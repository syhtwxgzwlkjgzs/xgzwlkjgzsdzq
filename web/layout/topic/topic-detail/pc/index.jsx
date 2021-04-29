import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { withRouter } from 'next/router';
import BaseLayout from '@components/base-layout';
import List from '@components/list'
import NoData from '@components/no-data';
import SectionTitle from '@layout/search/h5/components/section-title'
import DetailsHeader from './components/details-header';
@inject('site')
@inject('user')
@inject('index')
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
      this.searchData(value);
    });
  }
   // 右侧 - 活跃用户 版权信息
   renderRight = () => {
    // const { pageData = [] } = this.props.search.indexUsers || { pageData: [] };
    return (
      <>
      {
        // pageData?.length > 0 && (
          <div className={styles.topicRight}>
            <div className={styles.section}>
              <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser}/>
              {/* <ActiveUsers data={pageData} onItemClick={this.onUserClick}/> */}
            </div>
          </div>
        // )
      }
      </>
    )
  }
  // 中间 -- 话题
  renderContent = () => {
    const { pageData = [] } = this.props.topic?.topicDetail || {};
    return (
      <div className={styles.topicContent}>
        <DetailsHeader/>
        {
          pageData?.length
            ? pageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />)
            : <NoData />
        }
      </div>
    )
  }
  render() {
    return (
      <List className={styles.searchWrap}>
      <div className={styles.topicWrap}>
        <BaseLayout
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent }
        </BaseLayout>
        </div>
      </List>
    );
  }
}
export default withRouter(IndexPCPage);
