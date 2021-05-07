import React from 'react';
import styles from './index.module.scss';
import { Avatar, Input, Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';

// 用户中心发帖模块
@inject('user')
@observer
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
                  placeholder={'分享新鲜事'}
                />
              </div>
            </div>
            <div className={styles.userCenterPostList}>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'PictureOutlinedBig'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'VideoOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'MicroOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'ShoppingCartOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'QuestionOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'PaperClipOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'WalletOutlined'} />
              </div>
              <div  className={styles.userCenterPostListItem}>
                <Icon size={20} name={'DollarLOutlined'} />
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
