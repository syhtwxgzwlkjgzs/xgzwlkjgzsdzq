import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { Button, Icon, Toast } from '@discuzq/design';
import { ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post'
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static defaultProps = {
    isOtherPerson: false, // 表示是否是其他人
  }

  avatarUploaderRef = React.createRef(null);
  backgroundUploaderRef = React.createRef(null);
  handleAvatarUpload = () => {
    this.avatarUploaderRef.current.click();
  }
  onAvatarChange = (fileList) => {
    this.props.user.updateAvatar(fileList.target.files);
  }
  handleBackgroundUpload = () => {
    this.backgroundUploaderRef.current.click();
  }
  onBackgroundChange = (fileList) => {
    this.props.user.updateBackground(fileList.target.files);
  }
  // 点击关注
  handleChangeAttention = async (follow) => {
    const { query } = this.props.router
    if (query.otherId) {
      if (follow !== 0) {
        await this.props.user.cancelFollow({ id: query.otherId, type: 1 })
        await this.props.user.getTargetUserInfo(query.otherId)
      } else {
        await this.props.user.postFollow(query.otherId)
        await this.props.user.getTargetUserInfo(query.otherId)
      }
    }
  }
  // 渲染关注状态
  renderFollowedStatus = (follow) => {
    let icon = ""
    let text = ""
    switch (follow) {
      case 0: // 表示未关注
        icon = "PlusOutlined"
        text = '关注'
        break;
      case 1:
        icon = "CheckOutlined"
        text = '已关注'
        break
      case 2:
        icon = "WithdrawOutlined"
        text = '相互关注'
        break
      default:
        break;
    }
    return { icon, text }
  }
  // 点击屏蔽
  handleChangeShield = (isDeny) => {
    const { query } = this.props.router
    if (isDeny) {
      this.props.user.undenyUser(query.otherId)
      this.props.user.setTargetUserNotBeDenied()
      Toast.success({
        content: '解除屏蔽成功',
        hasMask: false,
        duration: 1000,
      })
    } else {
      this.props.user.denyUser(query.otherId)
      this.props.user.setTargetUserDenied()
      Toast.success({
        content: '屏蔽成功',
        hasMask: false,
        duration: 1000,
      })
    }
  }
  // 点击发送私信
  handleMessage = () => {
    const username = this.props.user.username
    Router.push({ url: `/message?page=chat&username=${username}` })
  }
  render() {
    const { targetUser } = this.props.user;
    const user = this.props.isOtherPerson ? targetUser || {} : this.props.user;
    console.log(this.props.user, 'head');
    return (
      <div className={styles.box}>
        <div className={styles.boxTop}>
          <div className={styles.headImgBox}>
            <Avatar image={user.avatarUrl} size='big' name={user.username} />
              {/* 相机图标 */}
            {
              !this.props.isOtherPerson && (
                <div className={styles.userCenterEditCameraIcon} onClick={this.handleAvatarUpload}>
                  <Icon name="CameraOutlined" />
                  <input onChange={this.onAvatarChange} ref={this.avatarUploaderRef} type="file" style={{ display: 'none' }} multiple={false} accept={ACCEPT_IMAGE_TYPES.join(',')} />
                </div>
              )
            }
        </div>
        <div className={styles.contentBox}>
          {/* 用户昵称和他所在的用户组名称 */}
          <div className={styles.userNameOrTeam}>
            <div className={styles.username}>{user.username}</div>
            <div className={styles.groupName}>{user.group?.groupName}</div>
            <p className={styles.text}>{user.signature || '不会开飞机的程序员，不是一个好的摄影师'}</p>
          </div>
          {
            this.props.isOtherPerson ? (
              <div className={styles.otherUserBtn}>
                <div onClick={() => { this.handleChangeShield(user.isDeny) }} className={styles.shieldBtn}>
                  <Icon name="ShieldOutlined" size={14}/>
                  <span>{user.isDeny ? '解除屏蔽' : '屏蔽'}</span>
                </div>
                <div className={styles.userBtn}>
                  <Button onClick={() => { this.handleChangeAttention(user.follow) }} type="primary" className={user.follow === 2 && styles.userFriendsBtn}>
                    <Icon name={this.renderFollowedStatus(user.follow || 0).icon} />
                    <span className={styles.userBtnText}>{this.renderFollowedStatus(user.follow || 0).text}</span>
                  </Button>
                  <Button onClick={this.handleMessage}>
                    <Icon name="NewsOutlined" />
                    <span className={styles.userBtnText}>发私信</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.upload} onClick={this.handleBackgroundUpload}>
                <input onChange={this.onBackgroundChange} ref={this.backgroundUploaderRef} type="file" style={{ display: 'none' }} />
                <Icon name="CameraOutlined" size={12} className={styles.uploadIcon}/>
                上传封面图
              </div>
            )
          }
        </div>
      </div>
    </div>)
  }
}

export default withRouter(index)
