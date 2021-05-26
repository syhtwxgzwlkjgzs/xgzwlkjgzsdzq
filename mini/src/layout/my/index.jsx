import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import Divider from '@discuzq/design/dist/components/divider/index';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import UserCenterAction from '@components/user-center-action';
import UserCenterThreads from '@components/user-center-threads';
import NoData from '@components/no-data';
@inject('user')
@observer
export default class index extends Component {

  componentDidMount = async () => {
    await this.props.user.getUserThreads();
  };

  render() {
    const { user } = this.props;
    const { userThreads, userThreadsTotalCount } = user;
    return (
      <View>
        <View className={styles.mobileLayout}>
          <UserCenterHeaderImage />
          <UserCenterHead />
          <View className={styles.unit}>
            <UserCenterAction />
          </View>
          <View className={styles.unit}>
            <View className={styles.threadUnit}>
              <View className={styles.threadTitle}>主题</View>
              <View className={styles.threadCount}>{userThreadsTotalCount}个主题</View>
            </View>

            <View className={styles.dividerContainer}>
              <Divider className={styles.divider} />
            </View>

            <View className={styles.threadItemContainer}>
              {userThreads && userThreads.length > 0 ? <UserCenterThreads data={userThreads} /> : <NoData />}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
