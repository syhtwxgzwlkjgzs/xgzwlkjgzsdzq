import React from 'react';
import styles from './index.module.scss';
import { Divider, Spin } from '@discuzq/design';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterPost from '@components/user-center-post';
import UserCenterAction from '@components/user-center-action';
import UserCenterThreads from '@components/user-center-threads';
import BaseLayout from '@components/base-layout';
import NoData from '@components/no-data';
import { withRouter } from 'next/router';
import Router from '@discuzq/sdk/dist/router';

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

  componentDidMount = async () => {
    const { query } = this.props.router;
    const id = this.props.user?.id;
    if (String(id) === query.id) {
      Router.push({ url: '/my' });
      return;
    }
    if (query.id) {
      await this.props.user.getTargetUserInfo(query.id);
      this.setState({
        fetchUserInfoLoading: false,
      });
    }
  };

  componentWillUnmount() {
    this.props.user.removeTargetUserInfo();
  }

  fetchTargetUserThreads = async () => {
    const { query } = this.props.router;
    if (query.id) {
      await this.props.user.getTargetUserThreads(query.id);
    }
  };

  render() {
    const { site, user } = this.props;
    const { platform } = site;
    const { targetUserThreads, targetUserThreadsTotalCount, targetUserThreadsPage, targetUserThreadsTotalPage } = user;
    return (
      <BaseLayout
        showHeader={true}
        showTabBar={false}
        immediateCheck={true}
        onRefresh={targetUserThreads && targetUserThreads.length > 0 ? this.fetchTargetUserThreads : null}
        noMore={targetUserThreadsTotalPage < targetUserThreadsPage}
      >
        <div className={styles.mobileLayout}>
          {this.state.fetchUserInfoLoading && (
            <div className={styles.loadingSpin}>
              <Spin type="spinner">加载中...</Spin>
            </div>
          )}
          {!this.state.fetchUserInfoLoading && (
            <>
              <UserCenterHeaderImage isOtherPerson={true} />
              <UserCenterHead platform={platform} isOtherPerson={true} />
            </>
          )}

          <div className={styles.unit}>
            <div className={styles.threadUnit}>
              <div className={styles.threadTitle}>主题</div>
              <div className={styles.threadCount}>{targetUserThreadsTotalCount}个主题</div>
            </div>

            <div className={styles.dividerContainer}>
              <Divider className={styles.divider} />
            </div>

            <div className={styles.threadItemContainer}>
              {targetUserThreads && targetUserThreads.length > 0 ? (
                <UserCenterThreads data={targetUserThreads} />
              ) : (
                <NoData />
              )}
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }
}

export default withRouter(H5OthersPage);
