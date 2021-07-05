import React from 'react';
import styles from './index.module.scss';
import { Divider, Spin, Toast } from '@discuzq/design';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterPost from '@components/user-center-post';
import UserCenterAction from '@components/user-center-action';
import UserCenterThreads from '@components/user-center-threads';
import BaseLayout from '@components/base-layout';

@inject('site')
@inject('user')
@observer
class H5MyPage extends React.Component {
  constructor(props) {
    super(props);
    this.isUnmount = false;
    this.state = {
      isLoading: true,
    };
  }

  fetchUserThreads = async () => {
    try {
      const userThreadsList = await this.props.user.getUserThreads();
      this.props.user.setUserThreads(userThreadsList);
    } catch (err) {
      console.error(err);
      let errMessage = '加载用户列表失败';
      if (err.Code && err.Code !== 0) {
        errMessage = err.Msg;
      }
      Toast.error({
        content: errMessage,
        duration: 2000,
        hasMask: false,
      });
    }
  };

  onRefresh = () => {
    const { isLoading } = this.state;

    // 避免第一次进入页面时，触发了上拉加载
    if (!isLoading) {
      return this.fetchUserThreads;
    }
    return Promise.resolve();
  };

  fetchUserThreads = async () => {
    try {
      const userThreadsList = await this.props.user.getUserThreads();
      if (!this.unMount) {
        this.props.user.setUserThreads(userThreadsList);
      }
    } catch (err) {
      let errMessage = '加载用户列表失败';
      if (err.Code && err.Code !== 0) {
        errMessage = err.Msg;
      }
      Toast.error({
        content: errMessage,
        duration: 2000,
        hasMask: false,
      });
    }
  };

  componentDidMount = async () => {
    if (this.props.user.id) {
      await this.props.user.updateUserInfo(this.props.user.id);

      try {
        this.props.user.userThreadsPage = 1;
        this.props.user.userThreadsTotalCount = 0;
        this.props.user.userThreadsTotalPage = 1;

        await this.fetchUserThreads();
      } catch (e) {
        console.error(e);
        if (e.Code) {
          Toast.error({
            content: e.Msg || '获取用户主题列表失败',
            duration: 2000,
          });
        }
      }
      this.setState({ isLoading: false });
    }
  };

  componentWillUnmount = () => {
    this.unMount = true;
    this.props.user.clearUserThreadsInfo();
  };

  formatUserThreadsData = (userThreads) => {
    if (Object.keys(userThreads).length === 0) return [];
    return Object.values(userThreads).reduce((fullData, pageData) => [...fullData, ...pageData]);
  };

  render() {
    const { isLoading } = this.state;
    const { site, user } = this.props;
    const { platform } = site;
    const { userThreads, userThreadsTotalCount, userThreadsPage, userThreadsTotalPage } = user;
    const formattedUserThreads = this.formatUserThreadsData(userThreads);

    return (
      <BaseLayout
        curr={'my'}
        showHeader={false}
        showTabBar={true}
        onRefresh={this.onRefresh}
        noMore={!isLoading && userThreadsPage >= userThreadsTotalPage}
        immediateCheck
      >
        <div className={styles.mobileLayout}>
          <UserCenterHeaderImage />
          <UserCenterHead platform={platform} />
          <div className={styles.unit}>
            <UserCenterAction />
          </div>
          <div className={styles.unit}>
            <UserCenterPost />
          </div>
          <div className={styles.unit}>
            <div className={styles.threadUnit}>
              <div className={styles.threadTitle}>主题</div>
              <div className={styles.threadCount}>{userThreadsTotalCount}个主题</div>
            </div>

            <div className={styles.dividerContainer}>
              <Divider className={styles.divider} />
            </div>

            <div className={styles.threadItemContainer}>
              {!isLoading && formattedUserThreads?.length > 0 && <UserCenterThreads data={formattedUserThreads} />}
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }
}

export default H5MyPage;
