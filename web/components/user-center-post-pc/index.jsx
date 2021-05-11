import React from 'react';
import styles from './index.module.scss';
import { Avatar, Input, Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { defaultOperation } from '@common/constants/const';
import { THREAD_TYPE } from '@common/constants/thread-post';

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
          <div
            style={{
              width: '100%',
            }}
          >
            <div className={styles.userCenterPostInfo}>
              <div className={styles.userCenterPostInput}>
                <Input
                  style={{
                    width: '100%',
                  }}
                  disabled
                  placeholder={'分享新鲜事'}
                />
              </div>
            </div>
            <div className={styles.userCenterPostList}>
              {this.props.user.threadExtendPermissions[THREAD_TYPE.image] && (
                <div className={styles.userCenterPostListItem}>
                  <Icon color={'#8490A8'} size={20} name={'PictureOutlinedBig'} />
                </div>
              )}
              {this.props.user.threadExtendPermissions[THREAD_TYPE.video] && (
                <div className={styles.userCenterPostListItem}>
                  <Icon color={'#8490A8'} size={20} name={'VideoOutlined'} />
                </div>
              )}
              {this.props.user.threadExtendPermissions[THREAD_TYPE.voice] && (
                <div className={styles.userCenterPostListItem}>
                  <Icon color={'#8490A8'} size={20} name={'MicroOutlined'} />
                </div>
              )}
              {this.props.user.threadExtendPermissions[THREAD_TYPE.goods] && (
                <div className={styles.userCenterPostListItem}>
                  <Icon color={'#8490A8'} size={20} name={'ShoppingCartOutlined'} />
                </div>
              )}
              {this.props.user.threadExtendPermissions.createThread && (
                <div className={styles.userCenterPostListItem}>
                  <Icon color={'#8490A8'} size={20} name={'QuestionOutlined'} />
                </div>
              )}
              {this.props.user.threadExtendPermissions[defaultOperation.attach] && (
                <div className={styles.userCenterPostListItem}>
                  <Icon color={'#8490A8'} size={20} name={'PaperClipOutlined'} />
                </div>
              )}
              {this.props.user.threadExtendPermissions[defaultOperation.redpacket] && (
                <div className={styles.userCenterPostListItem}>
                  <Icon color={'#8490A8'} size={20} name={'WalletOutlined'} />
                </div>
              )}
              {this.props.user.threadExtendPermissions[defaultOperation.pay] && (
                <div className={styles.userCenterPostListItem}>
                  <Icon color={'#8490A8'} size={20} name={'DollarLOutlined'} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserCenterPost.displayName = 'UserCenterPost';

export default UserCenterPost;
