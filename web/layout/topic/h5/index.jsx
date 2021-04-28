import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import Header from '@components/header';
import SearchInput from '@components/search-input';
import List from '@components/list';
import TopicHeader from './components/topic-header'
import TopicItem from './components/topic-item'

@inject('site')
@inject('user')
@inject('topic')
@observer
class TopicH5Page extends React.Component {
  state = {
    keyword: '',
    sort: ''
  }
  onSearch = (keyword = '') => {
    this.setState({
      keyword
    })
    const { dispatch } = this.props;
    return dispatch('refresh', { keyword });
  };
  onCancel = () => {
  };
  redirectTopicDetails = (id) => {
    this.props.router.push(`/topic/topic-detail/${id}`);
  };
  fetchMoreData = () => {
    const { dispatch } = this.props;

    return dispatch('moreData', this.state);
  }
  render() {
    const { pageData = [], currentPage = 0, totalPage = 0 } = this.props.topic?.topics || {}

    return (
      <div className={styles.topicWrap}>
        <Header />
        <div className={styles.topBox}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
        </div>
        <TopicHeader/>
        <List className={styles.list} noMore={currentPage >= totalPage} onRefresh={this.fetchMoreData}>
          {
            pageData?.map((item, index) => (
              <TopicItem data={item} key={index} onClick={() => this.redirectTopicDetails(item.pid)}/>  
            ))
          }
        </List>
      </div>
    );
  }
}
export default withRouter(TopicH5Page);
