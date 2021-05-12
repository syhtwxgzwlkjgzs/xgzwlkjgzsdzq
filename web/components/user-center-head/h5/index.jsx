import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { Button, Icon, Toast } from '@discuzq/design';
import clearLoginStatus from '@common/utils/clear-login-status';
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

  // 点击屏蔽
  handleChangeShield = (isDeny) => {
    const { query } = this.props.router
    if (isDeny) {
      this.props.user.undenyUser(query.otherId)
      Toast.success({
        content: '解除屏蔽成功',
        hasMask: false,
        duration: 1000,
      })
    } else {
      this.props.user.denyUser(query.otherId)
      Toast.success({
        content: '屏蔽成功',
        hasMask: false,
        duration: 1000,
      })
    }
  }

  // 点击关注
  handleChangeAttention = (follow) => {
    console.log(follow);
    const { query } = this.props.router
    if (query.otherId) {
      if (follow !== 0) {
        this.props.user.cancelFollow({ id: query.otherId, type: 1 })
        // this.props.user.setTargetUserUnFollowed(follow)
      } else {
        this.props.user.postFollow(query.otherId)
        // this.props.user.setTargetUserFollowed(follow)
      }
    }
  }

  logout = () => {
    clearLoginStatus();
    window.location.replace('/');
  }

  // 点击粉丝列表
  goToFansList = () => {
    const { query } = this.props.router
    if (query.otherId) {
      Router.push({ url: `/my/fans?isOtherPerson=${this.props.isOtherPerson}&otherId=${query.otherId}` })
    } else {
      Router.push({ url: `/my/fans?isOtherPerson=${this.props.isOtherPerson}` })
    }
  }

  // 点击关注列表
  goToFollowsList = () => {
    const { query } = this.props.router
    console.log(this.props.router);
    if (query.otherId) {
      Router.push({ url: `/my/follows?isOtherPerson=${this.props.isOtherPerson}&otherId=${query.otherId}` })
    } else {
      Router.push({ url: `/my/follows?isOtherPerson=${this.props.isOtherPerson}` })
    }
  }

  // 点击编辑资料
  goToMyEditInfo = () => {
    Router.push({ url: `my/edit` })
  }

  // 点击发送私信
  handleMessage = () => {
    const username = this.props.user.username
    Router.push({ url: `/message?page=chat&username=${username}` })
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

  render() {
    const { targetUser } = this.props.user;
    const user = this.props.isOtherPerson ? targetUser || {} : this.props.user;
    return (
      <div className={styles.h5box}>
        {/* 上 */}
        <div className={styles.h5boxTop}>
          <div className={styles.headImgBox}>
            <Avatar image={user.avatarUrl} size='big' name={user.username} />
          </div>
          {/* 粉丝|关注|点赞 */}
          <div className={styles.userMessageList}>
            <div onClick={this.goToFansList} className={styles.userMessageListItem}>
              <span>粉丝</span>
              <span>{user.fansCount || 0}</span>
            </div>
            <div onClick={this.goToFollowsList} className={styles.userMessageListItem}>
              <span>关注</span>
              <span>{user.followCount || 0}</span>
            </div>
            <div className={styles.userMessageListItem}>
              <span>点赞</span>
              <span>{user.likedCount || 0}</span>
            </div>
          </div>
        </div>
        {/* 中 用户昵称和他所在的用户组名称 */}
        <div>
          <div className={styles.userNameOrTeam}>
            <span>{user.username}</span>
            <span>{user.group?.groupName}</span>
          </div>
          <p className={styles.text}>{user.signature || '这个人很懒，什么也没留下~'}</p>
        </div>
        {/* 下 */}
        <div className={styles.userBtn}>
          {
            this.props.isOtherPerson ? (
              <>
                <Button onClick={() => { this.handleChangeAttention(user.follow) }} type="primary" className={user.follow === 2 && styles.userFriendsBtn}>
                  <Icon name={this.renderFollowedStatus(user.follow).icon} />
                  <span className={styles.userBtnText}>{this.renderFollowedStatus(user.follow).text}</span>
                </Button>
                <Button onClick={this.handleMessage}>
                  <Icon name="NewsOutlined" />
                  <span className={styles.userBtnText}>发私信</span>
                </Button>
              </>
            ) : (
              <>
                <Button onClick={this.goToMyEditInfo} type="primary">
                  <Icon name="CompileOutlined" />
                  <span className={styles.userBtnText}>编辑资料</span>
                </Button>
                <Button onClick={this.logout}>
                  <Icon name="PoweroffOutlined" />
                  <span className={styles.userBtnText}>退出登录</span>
                </Button>
              </>
            )
          }
        </div>
        {/* 右上角屏蔽按钮 */}
        {
          this.props.isOtherPerson && (
            <div onClick={() => {this.handleChangeShield(user.isDeny)}} className={styles.shieldBtn}>
              <Icon name="ShieldOutlined" />
              <span>{user.isDeny ? '解除屏蔽' : '屏蔽'}</span>
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(index)
