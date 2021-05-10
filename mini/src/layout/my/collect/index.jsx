import React from 'react';
import { inject, observer } from 'mobx-react';
import List from '@components/list';
import NoData from '@components/no-data';
import ThreadContent from '@components/thread';
import { Icon } from '@discuzq/design';
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
          {`${pageData?.length}条收藏`}
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
                    <View className={styles.listItem} key={index}>
                      <ThreadContent data={item}/>
                      <View className={styles.listItemBox}>
                        <Icon className={styles.listItemIcon} name='CollectOutlined' size={20} />
                      </View>
                    </View>
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