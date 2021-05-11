import React, { Component } from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import UserCenterHeaderImage from '@components/user-center-header-images';
import { Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
@inject('user')
@observer
export default class index extends Component {

  constructor(props) {
    super(props)
    this.user = this.props.user || {}
  }

  render() {
    return (
      <>
        <div className={styles.userCenterEditHeader}>
          <UserCenterHeaderImage />
          <div className={styles.headImgBox}>
            <Avatar image={this.user.avatarUrl} size='big' name={this.user.username} />
            {/* 相机图标 */}
            <div className={styles.userCenterEditCameraIcon}>
              <Icon name="CameraOutlined" />
            </div>
          </div>
          {/* 编辑修改说明 */}
          <div className={styles.userCenterEditDec}>
            <Icon name="CompileOutlined" />
            <span className={styles.text}>{this.user.signature || '没有签名的时候应该怎么展示'}</span>
          </div>
        </div>
      </>
    )
  }
}
