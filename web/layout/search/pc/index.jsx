import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../h5/components/section-title'
import TrendingTopicMore from './components/trending-topic-more';
import PopularContents from './components/popular-contents';
import ActiveUsersMore from './components/active-users-more';
import topicData from '../trending-topics';
import userData from '../active-users';
import contentData from '../popular-contents'
@inject('site')
@observer
class SearchPCPage extends React.Component {
  redirectToSearchResultPost = () => {
    this.props.router.push('/search/result-post');
  };

  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  };

  redirectToSearchResultTopic = () => {
    this.props.router.push('/search/result-topic');
  };
  onUserClick = data => console.log('user click', data);
  onTopicClick = data => console.log('topic click', data);
  onPostClick = data => console.log('post click', data);
  render() {
    return (
      <div className={styles.searchWrap}>
        <BaseLayout
          left={() => <div></div>}
          right={() => <div className={styles.searchRight}>
          </div>}
        >
          {
            () => <div className={styles.searchContent}>
              <div className={styles.section}>
                <SectionTitle title="潮流话题" onShowMore={this.redirectToSearchResultTopic} />
                <TrendingTopicMore data={topicData} onItemClick={this.onTopicClick}/>
              </div>
              <div className={styles.section}>
                <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser} />
                <ActiveUsersMore data={userData} onItemClick={this.onUserClick}/>
              </div>
              <div className={styles.section}>
                <SectionTitle title="热门内容" onShowMore={this.redirectToSearchResultPost} />
                <PopularContents data={contentData} onItemClick={this.onPostClick}/>
              </div>
            </div>
          }
        </BaseLayout>
      </div>
    );
  }
}

export default SearchPCPage;
