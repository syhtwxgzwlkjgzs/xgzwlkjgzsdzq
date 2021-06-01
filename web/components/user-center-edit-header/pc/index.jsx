import React, { Component } from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import UserCenterHeaderImage from '@components/user-center-header-images';
import { Icon, Input } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post'
import Router from '@discuzq/sdk/dist/router';


@inject('user')
@observer
export default class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isClickSignature: false
    }
    this.user = this.props.user || {}
  }

  avatarUploaderRef = React.createRef(null);
  backgroundUploaderRef = React.createRef(null);

  handleAvatarUpload = () => {
    this.avatarUploaderRef.current.click();
  }

  handleBackgroundUpload = () => {
    this.backgroundUploaderRef.current.click();
  }

  onAvatarChange = (fileList) => {
    this.props.user.updateAvatar(fileList.target.files);
  }

  onBackgroundChange = (fileList) => {
    this.props.user.updateBackground(fileList.target.files);
  }

  // 点击编辑签名
  handleClickSignature = () => {
    this.setState({
      isClickSignature: !this.state.isClickSignature
    })
  }

  // 签名change事件
  handleChangeSignature = (e) => {
    this.props.user.editSignature = e.target.value
  }

  handleBlurSignature = (e) => {
    this.props.user.editSignature = e.target.value
    this.setState({
      isClickSignature: false
    })
  }

  render() {
    return (
      <>
        <div className={styles.userCenterEditHeader}>
          <UserCenterHeaderImage className={styles.userCenterEditHeaderImg} onClick={this.handleBackgroundUpload} />
          {/* <input onChange={this.onBackgroundChange} ref={this.backgroundUploaderRef} type="file" style={{ display: 'none' }} /> */}
          <div className={styles.headImgBox}>
            <Avatar image={this.user.avatarUrl} size='big' name={this.user.username} />
            {/* 相机图标 */}
            <div className={styles.userCenterEditCameraIcon} onClick={this.handleAvatarUpload}>
              <Icon name="CameraOutlined" />
              <input onChange={this.onAvatarChange} ref={this.avatarUploaderRef} type="file" style={{ display: 'none' }} multiple={false} accept={ACCEPT_IMAGE_TYPES.join(',')} />
            </div>
          </div>
          {/* 上传封面图 */}
          <div className={styles.userCenterupload}>
            <Icon name="CameraOutlined" size={12} className={styles.userCenteruploadIcon}/>
            上传封面图
          </div>
          {/* 返回我的主页 */}
          <div className={`${styles.userCenterReturn} ${styles.userCenterupload}`} onClick={() => {
            Router.back();
          }}>
            <Icon name="ReturnOutlined" size={16} className={styles.userCenterReturnIcon}/>
            返回我的主页
          </div>
          {/* 编辑修改说明 */}
          <div className={styles.userCenterEditDec}>
            编辑资料
          </div>
        </div>
      </>
    )
  }
}