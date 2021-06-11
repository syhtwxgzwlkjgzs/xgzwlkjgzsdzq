import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import Divider from '@discuzq/design/dist/components/divider/index';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import UserCenterAction from '@components/user-center-action';
import Thread from '@components/thread';
import BaseLayout from '@components/base-layout'
import UserCenterPost from '../../components/user-center-post';
import SectionTitle from '@components/section-title'

@inject('user')
@observer
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount = async () => {
    await this.props.user.getUserThreads();
    this.setState({ isLoading: false })
  };

  // 处理页面栈退出后，数据没有重置
  componentWillUnmount() {
    this.props.user.clearUserThreadsInfo()
  }

  formatUserThreadsData = (userThreads) => {
    if (Object.keys(userThreads).length === 0) return [];
    return Object.values(userThreads).reduce((fullData, pageData) => [...fullData, ...pageData]);
  };

  onRefresh = () => {
    const { isLoading } = this.state

    // 避免第一次进入页面时，触发了上拉加载
    if (!isLoading) {
      return this.props.user.getUserThreads
    }
    return Promise.resolve()
  }

  render() {
    const { isLoading } = this.state
    const { user } = this.props;
    const { userThreads, userThreadsTotalCount, userThreadsPage, userThreadsTotalPage } = user;
    const formattedUserThreads = this.formatUserThreadsData(userThreads);

    return (
      <BaseLayout
        showHeader={false}
        showTabBar
        noMore={!isLoading && userThreadsPage >= userThreadsTotalPage}
        onRefresh={this.onRefresh}
        curr='my'
      >
        <View className={styles.mobileLayout}>
          <UserCenterHeaderImage />
          <UserCenterHead />
          <View className={styles.unit}>
            <UserCenterAction />
          </View>

          <View className={styles.unit}>
            <UserCenterPost />
          </View>

          <View className={`${styles.unit} ${styles.threadBackgroundColor}`}>
            <View className={styles.threadHeader}>
              <SectionTitle title='主题' isShowMore={false} leftNum={`${userThreadsTotalCount}个主题`} />
            </View>
        
            {!isLoading && formattedUserThreads?.map((item, index) => <Thread data={item} key={index} />)}
          </View>
        </View>
      </BaseLayout>
    )
  }
}
