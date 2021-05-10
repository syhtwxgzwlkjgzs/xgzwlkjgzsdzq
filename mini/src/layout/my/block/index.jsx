import React from 'react';
import { inject, observer } from 'mobx-react';
import List from '@components/list';
import NoData from '@components/no-data';
import { Button } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { View } from '@tarojs/components';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  render() {
    const { search } = this.props;
    const { users } = search;
    const { pageData = [], currentPage, totalPage } = users || {};
    console.log(this.props);
    return (
      <View className={styles.shieldBox}>
        <View className={styles.titleBox}>
          {`共有${pageData.length}位用户`}
        </View>
        {
          pageData?.length
            ? (
              <List
                className={styles.list}
                noMore={currentPage >= totalPage}
              >
                {
                  pageData.map((item, index) => (
                    <View className={styles.haieldImg} key={index}>
                      <View className={styles.haieldImgBox}>
                        <View className={styles.haieldImgHead}>
                          <Avatar 
                            className={styles.img}
                            image={item.avatar}
                            name={item.nickname}
                            userId={item.userId}
                          />
                          <View className={styles.haieldName}>{item.nickname}</View>
                        </View>
                        <View className={styles.haieldName}>
                          <Button className={styles.haieldButton}>解除屏蔽</Button>
                        </View>
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