import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import TrendingTopicMore from '../../../search/pc/components/trending-topic-more';
import ActiveUsers from '../../../search/pc/components/active-users'
import topicData from '../../trending-topics';
import userData from '../../active-users';
import { withRouter } from 'next/router';
@inject('site')
@observer
class SearchResultTopicPCPage extends React.Component {
  onTopicClick = data => console.log('topic click', data);
  render() {
    return (
      <div className={styles.searchWrap}>
        <BaseLayout
          left={() => <div></div>}
          right={() => <div className={styles.searchRight}>
              <div className={styles.section}>
                <SectionTitle title="活跃用户"/>
                <ActiveUsers data={userData} onItemClick={this.onUserClick}/>
              </div>
          </div>}
        >
          {
            () => <div className={styles.searchContent}>
              <div className={styles.section}>
                <SectionTitle title="潮流话题" isShowMore={false}/>
                <TrendingTopicMore data={topicData} onItemClick={this.onTopicClick}/>
              </div>
            </div>
          }
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(SearchResultTopicPCPage);
