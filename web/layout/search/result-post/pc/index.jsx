import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import ThreadContent from '@components/thread';
import { withRouter } from 'next/router';
@inject('site')
@inject('search')
@observer
class SearchResultPostH5Page extends React.Component {
  onPostClick = data => console.log('post click', data);
  renderContent = () => {
    const { threads } = this.props.search;
    const { pageData = [], currentPage, totalPage } = threads || { pageData: [] };
    return (
      <div className={styles.searchContent}>
        <div className={styles.section}>
          <SectionTitle title="热门内容" isShowMore={false}/>
          {
          pageData?.length
            ? pageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />)
            : <NoData />
        }
        </div>
      </div>
    )
  } 
  render() {
    return (
      <div className={styles.searchWrap}>
        <BaseLayout
          left={() => <div></div>}
          right={() => <div></div>}
        >
          { this.renderContent }
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(SearchResultPostH5Page);
