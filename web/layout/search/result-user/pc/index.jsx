import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import ActiveUsersMore from '../../../search/pc/components/active-users-more';
import TrendingTopic from '../../../search/pc/components/trending-topics'
import userData from '../../active-users';
import topicData from '../../trending-topics';
@inject('site')
@observer
class SearchResultUserPcPage extends React.Component {
  onTopicClick = data => console.log('topic click', data);
  onUserClick = data => console.log('user click', data);
  render() {
    return (
      <div className={styles.searchWrap}>
        <BaseLayout
          left={() => <div></div>}
          right={() => <div className={styles.searchRight}>
              <div className={styles.section}>
                <SectionTitle title="潮流话题"/>
                <TrendingTopic data={topicData} onItemClick={this.onTopicClick}/>
              </div>
          </div>}
        >
          {
            () => <div className={styles.searchContent}>
              <div className={styles.section}>
                <SectionTitle title="活跃用户" isShowMore={false} />
                <ActiveUsersMore data={userData} onItemClick={this.onUserClick}/>
              </div>
            </div>
          }
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(SearchResultUserPcPage);
