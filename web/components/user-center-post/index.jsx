import React from 'react';
import styles from './index.module.scss';
import { Avatar, Input, Icon } from '@discuzq/design';

// 用户中心发帖模块
class UserCenterPost extends React.Component {
  render() {
    return (
      <div className={styles.userCenterPost}>
        <div className={styles.userCenterPostTitle}>发帖</div>
        <div className={styles.userCenterPostContent}>
          <div className={styles.userCenterPostAvatar}>
            <Avatar text={'黑'} circle />
          </div>
          <div style={{
            width: '100%',
          }}>
            <div className={styles.userCenterPostInfo}>
              <div className={styles.userCenterPostInput}>
                <Input
                  style={{
                    width: '100%',
                  }}
                />
              </div>
            </div>
            <div className={styles.userCenterPostList}>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShareAltOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShareAltOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShareAltOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShareAltOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShareAltOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShareAltOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShareAltOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShareAltOutlined'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserCenterPost.displayName = 'UserCenterPost';

export default UserCenterPost;
