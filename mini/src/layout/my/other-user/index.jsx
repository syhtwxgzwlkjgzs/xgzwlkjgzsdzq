import React from 'react';
import styles from './index.module.scss';
import Spin from '@discuzq/design/dist/components/spin/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterThreads from '@components/user-center-threads';
import BaseLayout from '@components/base-layout';
import Router from '@discuzq/sdk/dist/router';
import { View, Text } from '@tarojs/components';
import Taro, { getCurrentInstance, eventCenter } from '@tarojs/taro';
import SectionTitle from '@components/section-title';
import BottomView from '@components/list/BottomView';

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
    // 因为这里的 onShow 的 flag 是路由，导致如果进入多个用户信息页面，重复触发了
    // 一个页面只负责一个用户 id，用此 flag 来解决重复加载的问题
    this.targetUserId = null;
  }

  $instance = getCurrentInstance();

  componentWillMount() {
    const onShowEventId = this.$instance.router.onShow;
    // 监听
    eventCenter.on(onShowEventId, this.onShow);
  }

  onShow = async () => {
    const { id = '' } = getCurrentInstance().router.params;
    if (!id) {
      Router.replace({ url: '/pages/home/index' });
    }
    if (!this.targetUserId) {
      this.targetUserId = id;
    }
    // 仅当前激活 id 的事件会触发
    if (this.targetUserId !== id) return;
    const myId = this.props.user?.id;
    if (String(myId) === this.targetUserId) {
      Router.replace({ url: '/subPages/my/index' });
      return;
    }
    if (this.targetUserId) {
      this.setState({
        fetchUserInfoLoading: true,
      });
      await this.props.user.getTargetUserInfo(this.targetUserId);
      this.setState({
        fetchUserInfoLoading: false,
      });
      await this.props.user.getTargetUserThreads(this.targetUserId);
    }
  };

  componentDidMount = async () => {
    const { id = '' } = getCurrentInstance().router.params;
    const myId = this.props.user?.id;
    if (String(myId) === id) {
      Router.replace({ url: '/subPages/my/index' });
      return;
    }
  };

  componentWillUnmount() {
    this.props.user.removeTargetUserInfo();
    const onShowEventId = this.$instance.router.onShow;
    // 卸载
    eventCenter.off(onShowEventId, this.onShow);
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

  getStatusBarHeight() {
    return wx?.getSystemInfoSync()?.statusBarHeight || 44;
  }

  // 全屏状态下自定义左上角返回按钮位置
  getTopBarBtnStyle() {
    return {
      position: 'fixed',
      top: `${this.getStatusBarHeight()}px`,
      left: '12px',
      transform: 'translate(0, 10px)',
    };
  }

  getTopBarTitleStyle() {
    return {
      position: 'fixed',
      top: `${this.getStatusBarHeight()}px`,
      left: '50%',
      transform: 'translate(-50%, 8px)',
    };
  }

  handleBack = () => {
    Taro.navigateBack();
  };

  // 渲染顶部title
  renderTitleContent = () => {
    const { user } = this.props;
    return (
      <View className={styles.topBar}>
        <View onClick={this.handleBack} className={styles.customCapsule} style={this.getTopBarBtnStyle()}>
          <Icon size={18} name="LeftOutlined" />
        </View>
        <View style={this.getTopBarTitleStyle()} className={styles.fullScreenTitle}>
          {user.targetUser?.nickname}的主页
        </View>
      </View>
    );
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
          {this.renderTitleContent()}
          {this.state.fetchUserInfoLoading && <BottomView isBox loadingText="加载中..." />}
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
              <SectionTitle title="主题" isShowMore={false} leftNum={`${targetUserThreadsTotalCount || 0}个主题`} />
            </View>

            <View className={styles.threadItemContainer}>
              {this.formatUserThreadsData(targetUserThreads) &&
                this.formatUserThreadsData(targetUserThreads).length > 0 && (
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
