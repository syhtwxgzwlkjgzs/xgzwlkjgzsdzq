import React from 'react';
import { Input, Icon, Button, Divider } from '@discuzq/design';
import Avatar from '@components/avatar';
import styles from './index.module.scss';

class UserCenterFriends extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.friendItem}>
          <div className={styles.friendInfo}>
            <div className={styles.friendAvatar}>
              <Avatar text={'黑'} circle />
            </div>
            <div className={styles.friendTextInfo}>
              <div className={styles.friendName}>I am a friend</div>
              <div className={styles.friendGroup}>I am friend group</div>
            </div>
          </div>
          <div className={styles.friendAction}>
            <Button type={'primary'} className={styles.friendActionFollow}>
              <Icon size={14} name={'PlusOutlined'} />
              <span>关注</span>
            </Button>
          </div>
        </div>

        <div className={styles.friendItem}>
          <div className={styles.friendInfo}>
            <div className={styles.friendAvatar}>
              <Avatar text={'黑'} circle />
            </div>
            <div className={styles.friendTextInfo}>
              <div className={styles.friendName}>I am a friend</div>
              <div className={styles.friendGroup}>I am friend group</div>
            </div>
          </div>
          <div className={styles.friendAction}>
            <Button type={'primary'} className={styles.friendActionFriend}>
              <Icon size={14} name={'WithdrawOutlined'} />
              <span>互关</span>
            </Button>
          </div>
        </div>

        <div className={styles.friendItem}>
          <div className={styles.friendInfo}>
            <div className={styles.friendAvatar}>
              <Avatar image={'123'} userId={38} isShowUserInfo={true} circle />
            </div>
            <div className={styles.friendTextInfo}>
              <div className={styles.friendName}>I am a friend</div>
              <div className={styles.friendGroup}>I am friend group</div>
            </div>
          </div>
          <div className={styles.friendAction}>
            <Button type={'primary'} className={styles.friendActionFollowed}>
              <Icon size={14} name={'CheckOutlined'} />
              <span>已关注</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserCenterFriends;
