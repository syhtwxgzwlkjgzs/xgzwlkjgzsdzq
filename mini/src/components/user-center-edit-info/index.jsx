import React, { Component } from 'react'
import UserCenterEditHeader from '../user-center-edit-header'
import { Button, Icon, Input } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
// import HOCFetchSiteData from '../../../middleware/HOCFetchSiteData'
import { View, Text } from '@tarojs/components';
@inject('site')
@inject('user')
@observer
class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isClickNickName: false
    }
    this.user = this.props.user || {}
  }

  initState = () => {
    this.setState({
      isClickNickName: false
    })
  }

  componentDidMount() {
    this.initState()
    this.props.user.initEditInfo()
  }

  // 点击取消
  handleCancel = () => {
    Router.back()
  }

  handleClickNickName = () => {
    this.setState({
      isClickNickName: !this.state.isClickNickName
    })
  }

  handleChangeNickName = (e) => {
    let value = e.target.value
    this.props.user.editNickName = value
  }

  handleBlurNickName = (e) => {
    let value = e.target.value
    this.props.user.editNickName = value
    this.setState({
      isClickNickName: false
    })
  }

  // 渲染修改用户名
  renderInputNickName = () => {
    const { isClickNickName } = this.state
    return (
      <View className={styles.userCenterEditLabel}>
        <Text>昵称</Text>
        <View>{isClickNickName ? <Input focus={true} maxLength={10} value={this.user.editNickName} onChange={this.handleChangeNickName} onBlur={this.handleBlurNickName} /> : this.user.editNickName}</View>
      </View>
    )
  }

  handleUpdateEditedUserInfo = () => {
    this.props.user.updateEditedUserInfo()
    Router.push({url: `/my`})
  }

  handleGoToEditMobile = () => {
    console.log('去到修改手机号页面');
    Router.push({url: `/my/edit/mobile`})
  }

  handleGoToEditAccountPwd = () => {
    console.log('去到修改账户密码页面');
    Router.push({url: `/my/edit/pwd`})
  }

  handleGoToEditPayPwd = () => {
    console.log('去到修改支付密码页面');
    Router.push({url: '/my/edit/paypwd'})
  }

  render() {
    return (
      <View>
        {/* 头部 */}
        <View><UserCenterEditHeader /></View>
        {/* middle */}
        <View className={styles.userCenterEditMiddle}>
          <h3>个人信息</h3>
          <View onClick={this.handleClickNickName} className={styles.userCenterEditItem}>
            {this.renderInputNickName()}
          </View>
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>用户名</Text>
              <View>{this.user.editUserName}</View>
            </View>
          </View>
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>手机号码</Text>
              <View>{this.user.mobile}</View>
            </View>
            <View onClick={this.handleGoToEditMobile}><Icon name="RightOutlined" /></View>
            {/* {
              this.props.site.isSmsOpen && (
                <View><Icon name="RightOutlined" /></View>
              )
            } */}
          </View>
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>账户密码</Text>
              <View>修改</View>
            </View>
            <View onClick={this.handleGoToEditAccountPwd}><Icon name="RightOutlined" /></View>
          </View>
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>支付密码</Text>
              <View>修改</View>
            </View>
            <View onClick={this.handleGoToEditPayPwd}><Icon name="RightOutlined" /></View>
          </View>
          <View className={styles.userCenterEditItem} style={{ border: 'none' }}>
            <View className={styles.userCenterEditLabel}>
              <Text>微信</Text>
              <View className={styles.userCenterEditWeChat}>{
                this.user.unionid ? <>
                  <Avatar size="small" image={this.user.avatarUrl} name={this.user.username} /> <Text>{this.user.nickname}（解绑）</Text>
                </> : '暂未绑定'
              }</View>
            </View>
          </View>
        </View>
        {/* bottom */}
        <View className={styles.userCenterEditBottom}>
          {/* <h3>实名认证</h3>
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>申请实名认证</Text>
              <View>去认证</View>
            </View>
            <View><Icon name="RightOutlined" /></View>
          </View> */}
          <View className={styles.userCenterEditBtn}>
            <Button onClick={this.handleCancel}>取消</Button>
            <Button onClick={this.handleUpdateEditedUserInfo} type="primary">保存</Button>
          </View>
        </View>
      </View>
    )
  }
}

export default index
