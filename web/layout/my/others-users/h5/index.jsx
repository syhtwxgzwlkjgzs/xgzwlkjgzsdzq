import React from 'react';
import styles from './index.module.scss';
import { Divider } from '@discuzq/design';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterPost from '@components/user-center-post';
import UserCenterAction from '@components/user-center-action';
import UserCenterThreads from '@components/user-center-threads';
import BaseLayout from '@components/base-layout';
import NoData from '@components/no-data';
import { withRouter } from 'next/router';

@inject('site')
@inject('user')
@observer
class H5OthersPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.user.cleanTargetUserThreads();
  }

  componentDidMount = async () => {
    const { query } = this.props.router;
    if (query.otherId) {
      await this.props.user.getTargetUserInfo(query.otherId);
      await this.props.user.getTargetUserThreads(query.otherId);
    }
  };

  render() {
    const { site, user } = this.props;
    const { platform } = site;
    const { targetUserThreads, targetUserThreadsTotalCount, targetUserThreadsPage, targetUserThreadsTotalPage } = user;
    return (
      <BaseLayout
        showHeader={false}
        showTabBar={false}
        onRefresh={user.getTargetUserThreads}
        noMore={targetUserThreadsTotalPage <= targetUserThreadsPage}
      >
        <div className={styles.mobileLayout}>
          <UserCenterHeaderImage isOtherPerson={true} />
          <UserCenterHead platform={platform} isOtherPerson={true} />
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
