import React from 'react';
import { Spin } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import Header from '@components/header';
import List from '@components/list';
import NoData from '@components/no-data';
import ThreadContent from '@components/thread';
import styles from './index.module.scss';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { index, loading } = this.props;
    const { pageData = [], currentPage, totalPage } = index.threads || {};
    return (
      <div>
        <Header />
        {
          loading && <Spin type="spinner" size={14}></Spin>
        }
        {
          this.props.firstLoading && (
            <div className={styles.spinLoading}><Spin type="spinner">加载中...</Spin></div>
          )
        }
        {
          pageData?.length
            ? (
              <List
                className={styles.list}
                noMore={currentPage >= totalPage}
              >
                {
                  pageData?.map((item, index) => (
                    <ThreadContent className={styles.listItem} key={index} data={item} />
                  ))
                }
              </List>
            )
            : <>{!this.props.firstLoading && <NoData className={styles.noDataList} />}</>
        }
      </div>
    );
  }
}

export default withRouter(Index);
