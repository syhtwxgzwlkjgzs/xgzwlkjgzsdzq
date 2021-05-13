import React from 'react';
import { inject, observer } from 'mobx-react';
import List from '@components/list';
import NoData from '@components/no-data';
import ThreadContent from '@components/thread';
import styles from './index.module.scss';
import { View } from '@tarojs/components';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  render() {
    const { index } = this.props;
    const { threads = {} } = index;
    const { currentPage, totalPage, pageData = [] } = threads || {};

    return (
      <View className={styles.collectBox}>
        <View className={styles.titleBox}>
          {`${pageData?.length}条购买`}
        </View>
        {
          pageData?.length
            ? (
              <List
                className={styles.list}
                noMore={currentPage >= totalPage}
              >
                {
                  pageData?.map((item, index) => (
                    <ThreadContent className={styles.listItem} key={index} data={item}/>
                  ))
                }
              </List>
            )
            : <NoData />
        }
      </View>
    );
  }
}

export default Index;