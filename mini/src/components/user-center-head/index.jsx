import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import clearLoginStatus from '@common/utils/clear-login-status';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
import { View, Text } from '@tarojs/components';

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
    const { query = {} } = this.props.router
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

  // 点击关注
  handleChangeAttention = async (follow) => {
    const { query = {} } = this.props.router
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

  logout = () => {
    clearLoginStatus();
    window.location.replace('/');
  }

  // 点击粉丝列表
  goToFansList = () => {
    const { query = {} } = this.props.router
    if (query.otherId) {
      Router.push({ url: `/my/fans?isOtherPerson=${this.props.isOtherPerson}&otherId=${query.otherId}` })
    } else {
      Router.push({ url: `/my/fans?isOtherPerson=${this.props.isOtherPerson}` })
    }
  }

  // 点击关注列表
  goToFollowsList = () => {
    const { query = {} } = this.props.router
    if (query.otherId) {
      Router.push({ url: `/my/follows?isOtherPerson=${this.props.isOtherPerson}&otherId=${query.otherId}` })
    } else {
      Router.push({ url: `/my/follows?isOtherPerson=${this.props.isOtherPerson}` })
    }
  }

  // 点击编辑资料
  goToMyEditInfo = () => {
    Router.push({ url: `edit/index` })
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
      <View className={styles.h5box}>
        {/* 上 */}
        <View className={styles.h5boxTop}>
          <View className={styles.headImgBox}>
            <Avatar image={user.avatarUrl} size='big' name={user.username} />
          </View>
          {/* 粉丝|关注|点赞 */}
          <View className={styles.userMessageList}>
            <View onClick={this.goToFansList} className={styles.userMessageListItem}>
              <Text>粉丝</Text>
              <Text>{user.fansCount || 0}</Text>
            </View>
            <View onClick={this.goToFollowsList} className={styles.userMessageListItem}>
              <Text>关注</Text>
              <Text>{user.followCount || 0}</Text>
            </View>
            <View className={styles.userMessageListItem}>
              <Text>点赞</Text>
              <Text>{user.likedCount || 0}</Text>
            </View>
          </View>
        </View>
        {/* 中 用户昵称和他所在的用户组名称 */}
        <View>
          <View className={styles.userNameOrTeam}>
            <Text>{user.username}</Text>
            <Text>{user.group?.groupName}</Text>
          </View>
          <Text className={styles.text}>{user.signature || '这个人很懒，什么也没留下~'}</Text>
        </View>
        {/* 下 */}
        <View className={styles.userBtn}>
          {
            this.props.isOtherPerson ? (
              <>
                <Button onClick={() => { this.handleChangeAttention(user.follow) }} type="primary" className={user.follow === 2 && styles.userFriendsBtn}>
                  <Icon name={this.renderFollowedStatus(user.follow).icon} />
                  <Text className={styles.userBtnText}>{this.renderFollowedStatus(user.follow).text}</Text>
                </Button>
                <Button onClick={this.handleMessage}>
                  <Icon name="NewsOutlined" />
                  <Text className={styles.userBtnText}>发私信</Text>
                </Button>
              </>
            ) : (
              <>
                <Button onClick={this.goToMyEditInfo} type="primary">
                  <Icon name="CompileOutlined" />
                  <Text className={styles.userBtnText}>编辑资料</Text>
                </Button>
                <Button onClick={this.logout}>
                  <Icon name="PoweroffOutlined" />
                  <Text className={styles.userBtnText}>退出登录</Text>
                </Button>
              </>
            )
          }
        </View>
        {/* 右上角屏蔽按钮 */}
        {
          this.props.isOtherPerson && (
            <View onClick={() => { this.handleChangeShield(user.isDeny) }} className={styles.shieldBtn}>
              <Icon name="ShieldOutlined" />
              <Text>{user.isDeny ? '解除屏蔽' : '屏蔽'}</Text>
            </View>
          )
        }
      </View>
    );
  }
}

export default withRouter(index)
