import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import Header from '@components/header';
import List from '@components/list';
import NoData from '@components/no-data';
import ThreadContent from '@components/thread';
import { Spin } from '@discuzq/design';
import styles from './index.module.scss';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { index, site } = this.props;
    const { pageData = [], currentPage, totalPage } = index.threads || {};

    return (
      <div className={styles.collectBox}>
        <Header />
        <div className={styles.titleBox}>
          {`${pageData?.length} 条收藏`}
        </div>
        {
          this.props.firstLoading && (
            <div className={styles.spinLoading}><Spin type="spinner">加载中...</Spin></div>
          )
        }
        {
          pageData?.length
            ? (
              <List
                className={`${styles.list} ${styles.noDataList}`}
                noMore={currentPage >= totalPage}
              >
                {
                  pageData?.map((item, index) => (
                    <div className={styles.listItem} key={index}>
                      <ThreadContent data={item} collect={'collect'} />
                    </div>
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
