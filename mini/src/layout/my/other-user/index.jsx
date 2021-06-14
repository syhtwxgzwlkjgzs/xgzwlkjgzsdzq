import React from 'react';
import styles from './index.module.scss';
import Spin from '@discuzq/design/dist/components/spin/index';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterThreads from '@components/user-center-threads';
import BaseLayout from '@components/base-layout';
import Router from '@discuzq/sdk/dist/router';
import { View, Text } from '@tarojs/components';
import Taro, { getCurrentInstance, eventCenter } from '@tarojs/taro';
import SectionTitle from '@components/section-title'
import BottomView from '@components/list/BottomView'

@inject('site')
@inject('user')
@observer
class H5OthersPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.user.cleanTargetUserThreads();
    this.state = {
      fetchUserInfoLoading: true,
    };
  }

  $instance = getCurrentInstance()

  componentWillMount () {
    const onShowEventId = this.$instance.router.onShow
    // 监听
    eventCenter.on(onShowEventId, this.onShow)
  }

  onShow = async () => {
    const { id = '' } = getCurrentInstance().router.params;
    const myId = this.props.user?.id;
    if (String(myId) === id) {
      Router.replace({ url: '/subPages/my/index' });
      return;
    }
    if (id) {
      await this.props.user.getTargetUserInfo(id);
    }
  }

  componentDidMount = async () => {
    const { id = '' } = getCurrentInstance().router.params;
    const myId = this.props.user?.id;
    if (String(myId) === id) {
      Router.replace({ url: '/subPages/my/index' });
      return;
    }
    if (id) {
      await this.props.user.getTargetUserInfo(id);
      await this.props.user.getTargetUserThreads(id);
      this.setState({
        fetchUserInfoLoading: false,
      });
    }
  };

  componentWillUnmount() {
    this.props.user.removeTargetUserInfo();
  }

  fetchTargetUserThreads = async () => {
    const { id = '' } = getCurrentInstance().router.params;
    if (id) {
      await this.props.user.getTargetUserThreads(id);
    }
    return;
  };

  formatUserThreadsData = (targetUserThreads) => {
    if (Object.keys(targetUserThreads).length === 0) return [];
    return Object.values(targetUserThreads).reduce((fullData, pageData) => [...fullData, ...pageData]);
  };

  render() {
    const { site, user } = this.props;
    const { platform } = site;
    const { targetUserThreads, targetUserThreadsTotalCount, targetUserThreadsPage, targetUserThreadsTotalPage } = user;
    return (
      <BaseLayout
        showHeader={false}
        showTabBar={false}
        immediateCheck={true}
        onRefresh={this.fetchTargetUserThreads}
        noMore={targetUserThreadsTotalPage < targetUserThreadsPage}
      >
        <View className={styles.mobileLayout}>
          {this.state.fetchUserInfoLoading && <BottomView isBox loadingText='加载中...' />}
          {!this.state.fetchUserInfoLoading && (
            <>
              <UserCenterHeaderImage isOtherPerson={true} />
              <UserCenterHead platform={platform} isOtherPerson={true} />
            </>
          )}

          <View className={styles.unit}>
            {/* <View className={styles.threadUnit}>
              <View className={styles.threadTitle}>主题</View>
              <View className={styles.threadCount}>{targetUserThreadsTotalCount}个主题</View>
            </View> */}

            {/* <View className={styles.ViewiderContainer}>
              <Viewider className={styles.Viewider} />
            </View> */}

            <View className={styles.threadHeader}>
              <SectionTitle title='主题' isShowMore={false} leftNum={`${targetUserThreadsTotalCount}个主题`} />
            </View>

            <View className={styles.threadItemContainer}>
              {this.formatUserThreadsData(targetUserThreads)
              && this.formatUserThreadsData(targetUserThreads).length > 0 && (
                <UserCenterThreads data={this.formatUserThreadsData(targetUserThreads)} />
              )}
            </View>
          </View>
        </View>
      </BaseLayout>
    );
  }
}

export default H5OthersPage;
