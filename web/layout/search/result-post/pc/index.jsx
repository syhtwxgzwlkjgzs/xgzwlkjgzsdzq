import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import PopularContents from '../../../search/pc/components/popular-contents';
import contentData from '../../popular-contents'
import { withRouter } from 'next/router';
@inject('site')
@observer
class SearchResultPostH5Page extends React.Component {
  onPostClick = data => console.log('post click', data);
  renderContent = () => {
    return (
      <div className={styles.searchContent}>
        <div className={styles.section}>
          <SectionTitle title="热门内容" isShowMore={false}/>
          <PopularContents data={contentData} onItemClick={this.onPostClick}/>
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
