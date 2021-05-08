import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import Header from '@components/header';
import List from '@components/list';
import NoData from '@components/no-data';
import ThreadContent from '@components/thread';
import { Icon } from '@discuzq/design';
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
    const { pageData = [], currentPage, totalPage } = index.threads;

    return (
      <div className={styles.collectBox}>
        <Header />
        <div className={styles.titleBox}>
          12条收藏
        </div>
        {
          pageData?.length
            ? (
              <List
                className={styles.list}
                noMore={currentPage >= totalPage}
              >
                {
                  pageData?.map((item, index) => (
                    <div className={styles.listItem} key={index}>
                      <ThreadContent data={item}/>
                      <div className={styles.listItemBox}>
                        <Icon className={styles.listItemIcon} name='CollectOutlined' size={20} />
                      </div>
                    </div>
                  ))
                }
              </List>
            )
            : <NoData />
        }
      </div>
    );
  }
}

export default withRouter(Index);