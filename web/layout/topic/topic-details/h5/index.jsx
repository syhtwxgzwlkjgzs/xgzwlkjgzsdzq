import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import Header from '@components/header';
import List from '@components/list';
import NoData from '@components/no-data';
import DetailsHeader from './components/details-header'
import ThreadContent from '@components/thread';

@inject('site')
@inject('user')
@inject('index')
@observer
class TopicH5Page extends React.Component {
  onSearch = (keyword) => {
  };
  onCancel = () => {
  };
  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  };
  render() {
    const { index } = this.props;
    const { threads = {} } = index;
    const { currentPage, totalPage, pageData } = threads || {};
    return (
      <List className={styles.topicWrap} allowRefresh={false}>
        <Header/>
        <DetailsHeader title='科技新鲜事'/>
        <div className={styles.themeContent}>
          {
            pageData?.length ?
              (
                pageData?.map((item, index) => (
                  <ThreadContent data={item} key={index} className={styles.item} />
                ))
              )
              : <NoData />
          }
        </div>
      </List>
    );
  }
}
export default withRouter(TopicH5Page);
