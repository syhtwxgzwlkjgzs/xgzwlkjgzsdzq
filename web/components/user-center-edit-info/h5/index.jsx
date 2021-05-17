import React, { Component } from 'react';
import UserCenterEditHeader from '../../user-center-edit-header/index';
import { Button, Icon, Input } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import HOCFetchSiteData from '../../../middleware/HOCFetchSiteData';
@inject('site')
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClickNickName: false,
    };
    this.user = this.props.user || {};
  }

  initState = () => {
    this.setState({
      isClickNickName: false,
    });
  }

  componentDidMount() {
    this.initState()
    const id = this.props.user?.id
    this.props.user.updateUserInfo(id)
    this.props.user.initEditInfo()
  }

  // 点击取消
  handleCancel = () => {
    Router.back();
  }

  handleClickNickName = () => {
    this.setState({
      isClickNickName: !this.state.isClickNickName,
    });
  }

  handleChangeNickName = (e) => {
    const { value } = e.target;
    this.props.user.editNickName = value;
  }

  handleBlurNickName = (e) => {
    const { value } = e.target;
    this.props.user.editNickName = value;
    this.setState({
      isClickNickName: false,
    });
  }

  // 渲染修改用户名
  renderInputNickName = () => {
    const { isClickNickName } = this.state;
    return (
      <div className={styles.userCenterEditLabel}>
        <label>昵称</label>
        <div>{isClickNickName ? <Input focus={true} maxLength={10} value={this.user.editNickName} onChange={this.handleChangeNickName} onBlur={this.handleBlurNickName} /> : this.user.editNickName}</div>
      </div>
    );
  }

  handleUpdateEditedUserInfo = () => {
    this.props.user.updateEditedUserInfo();
    Router.push({ url: '/my' });
  }

  handleGoToEditMobile = () => {
    console.log('去到修改手机号页面');
    Router.push({ url: '/my/edit/mobile' });
  }

  handleGoToEditAccountPwd = () => {
    console.log('去到修改账户密码页面');
    Router.push({ url: '/my/edit/pwd' });
  }

  handleGoToEditPayPwd = () => {
    console.log('去到修改支付密码页面');
    Router.push({ url: '/my/edit/paypwd' });
  }

  render() {
    return (
      <div>
        {/* 头部 */}
        <div><UserCenterEditHeader /></div>
        {/* middle */}
        <div className={styles.userCenterEditMiddle}>
          <h3>个人信息</h3>
          <div onClick={this.handleClickNickName} className={styles.userCenterEditItem}>
            {this.renderInputNickName()}
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>用户名</label>
              <div>{this.user.editUserName}</div>
            </div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>手机号码</label>
              <div>{this.user.mobile}</div>
            </div>
            <div onClick={this.handleGoToEditMobile}><Icon name="RightOutlined" /></div>
            {/* {
              this.props.site.isSmsOpen && (
                <div><Icon name="RightOutlined" /></div>
              )
            } */}
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>账户密码</label>
              <div>修改</div>
            </div>
            <div onClick={this.handleGoToEditAccountPwd}><Icon name="RightOutlined" /></div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>支付密码</label>
              <div>修改</div>
            </div>
            <div onClick={this.handleGoToEditPayPwd}><Icon name="RightOutlined" /></div>
          </div>
          <div className={styles.userCenterEditItem} style={{ border: 'none' }}>
            <div className={styles.userCenterEditLabel}>
              <label>微信</label>
              <div className={styles.userCenterEditWeChat}>{
                this.user.unionid ? <>
                  <Avatar size="small" image={this.user.avatarUrl} name={this.user.username} /> <span>{this.user.nickname}（解绑）</span>
                </> : '暂未绑定'
              }</div>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className={styles.userCenterEditBottom}>
          {/* <h3>实名认证</h3>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>申请实名认证</label>
              <div>去认证</div>
            </div>
            <div><Icon name="RightOutlined" /></div>
          </div> */}
          <div className={styles.userCenterEditBtn}>
            <Button onClick={this.handleCancel}>取消</Button>
            <Button onClick={this.handleUpdateEditedUserInfo} type="primary">保存</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default index;
