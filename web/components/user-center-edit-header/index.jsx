import React, { Component } from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import UserCenterHeaderImage from '@components/user-center-header-images';
import { Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post'


@inject('user')
@observer
export default class index extends Component {

  constructor(props) {
    super(props)
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

  render() {
    return (
      <>
        <div className={styles.userCenterEditHeader}>
          <UserCenterHeaderImage onClick={this.handleBackgroundUpload}/>
          <input onChange={this.onBackgroundChange} ref={this.backgroundUploaderRef} type="file" style={{ display: 'none' }}/>
          <div className={styles.headImgBox}>
            <Avatar image={this.user.avatarUrl} size='big' name={this.user.username} />
            {/* 相机图标 */}
            <div className={styles.userCenterEditCameraIcon} onClick={this.handleAvatarUpload}>
              <Icon name="CameraOutlined" />
              <input onChange={this.onAvatarChange} ref={this.avatarUploaderRef} type="file" style={{ display: 'none' }} multiple={false} accept={ACCEPT_IMAGE_TYPES.join(',')}/>
            </div>
          </div>
          {/* 编辑修改说明 */}
          <div className={styles.userCenterEditDec}>
            <Icon name="CompileOutlined" />
            <span className={styles.text}>{this.user.signature || '这个人很懒，什么也没留下~'}</span>
          </div>
        </div>
      </>
    )
  }
}
