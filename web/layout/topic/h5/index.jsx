import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import Header from '@components/header';
import SearchInput from '@components/search-input';
import List from '@components/list';
import TopicHeader from './components/topic-header'
import TopicList from './components/topic-list'
import topicData from '../topics';

@inject('site')
@inject('user')
@inject('index')
@observer
class TopicH5Page extends React.Component {
  onSearch = (keyword) => {
  };
  onCancel = () => {
  };
  redirectTopicDetails = () => {
    this.props.router.push('/topic/topic-details');
  };
  render() {
    return (
      <List className={styles.topicWrap} allowRefresh={false}>
        <Header />
        <div className={styles.topBox}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
        </div>
        <TopicHeader/>
        <TopicList data={topicData} onItemClick={this.redirectTopicDetails}/>
      </List>
    );
  }
}
export default withRouter(TopicH5Page);
