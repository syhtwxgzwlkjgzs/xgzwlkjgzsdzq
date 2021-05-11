import React from 'react';
import styles from './index.module.scss';
import { Divider } from '@discuzq/design';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';
import UserCenterPost from '@components/user-center-post';
import UserCenterFollow from '@components/user-center-follow';
import UserCenterAction from '@components/user-center-action';
import UserCenterThreads from '@components/user-center-threads';
import BottomNavBar from '@components/bottom-nav-bar';
import UserCenterEditInfo from '@components/user-center-edit-info';
import Thread from '@components/thread';
import List from '@components/list';
import BaseLayout from '@components/base-layout';
import NoData from '@components/no-data';

@inject('site')
@inject('user')
@observer
class H5MyPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    await this.props.user.getUserThreads();
  };

  render() {
    const { site, user } = this.props;
    const { platform } = site;
    const { userThreads, userThreadsTotalCount, userThreadsPage, userThreadsTotalPage } = user;
    // return <UserCenterEditInfo />
    return (
      <BaseLayout
        curr={'my'}
        showHeader={false}
        showTabBar={true}
        onRefresh={user.getUserThreads}
        noMore={userThreadsTotalPage >= userThreadsPage}
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
              {userThreads && userThreads.length > 0 ? <UserCenterThreads data={userThreads} /> : <NoData />}
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }
}

export default H5MyPage;
