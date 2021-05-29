import React, { Component } from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import UserCenterHeaderImage from '@components/user-center-header-images';
import { Icon, Input, Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { USER_IMAGE_TYPES } from '@common/constants/user-center-image-pattern';
import { fixImageOrientation } from '@common/utils/exif';
import { detectImageAutomaticRotation } from '@common/utils/detect-image-automatic-rotation';

@inject('user')
@observer
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClickSignature: false, // 是否点击签名
      isUploadAvatarUrl: false, // 是否上传头像
      isUploadBackgroundUrl: false, // 是否上传背景图片
    };
    this.user = this.props.user || {};
  }

  componentDidMount() {
    // this.user.initEditInfo()
  }

  avatarUploaderRef = React.createRef(null);
  backgroundUploaderRef = React.createRef(null);

  handleAvatarUpload = () => {
    this.avatarUploaderRef.current.click();
  };

  handleBackgroundUpload = () => {
    this.backgroundUploaderRef.current.click();
  };

  onAvatarChange = async (fileList) => {
    this.setState({
      isUploadAvatarUrl: true,
    });
    let fixedImg;

    const IS_IMG_AUTO_ROTATE = await detectImageAutomaticRotation();

    if (IS_IMG_AUTO_ROTATE) {
      fixedImg = fileList.target.files[0];
    } else {
      fixedImg = await fixImageOrientation(fileList.target.files[0]);
    }

    this.props.user
      .updateAvatar(fixedImg)
      .then((res) => {
        const id = this.user.id;
        if (id === res.id && res.avatarUrl) {
          // this.user.editAvatarUrl = res.avatarUrl;
          Toast.success({
            content: '上传头像成功',
            hasMask: false,
            duration: 1000,
          });
          this.setState({
            isUploadAvatarUrl: false,
          });
        }
      })
      .catch((err) => {
        Toast.error({
          content: err.Msg || '上传头像失败',
          hasMask: false,
          duration: 1000,
        });
        this.setState({
          isUploadAvatarUrl: false,
        });
        // 上传失败 应该取之前用户的头像
        // this.user.editAvatarUrl = this.user.avatarUrl;
      });
  };

  onBackgroundChange = async (fileList) => {
    this.setState({
      isUploadBackgroundUrl: true,
    });
    let fixedImg;

    const IS_IMG_AUTO_ROTATE = await detectImageAutomaticRotation();

    if (IS_IMG_AUTO_ROTATE) {
      fixedImg = fileList.target.files[0];
    } else {
      fixedImg = await fixImageOrientation(fileList.target.files[0]);
    }
    this.props.user
      .updateBackground(fixedImg)
      .then((res) => {
        const id = this.user.id;
        if (id === res.id && res.backgroundUrl) {
          Toast.success({
            content: '上传成功',
            hasMask: false,
            duration: 1000,
          });
          this.setState({
            isUploadBackgroundUrl: false,
          });
        }
      })
      .catch((err) => {
        Toast.error({
          content: err.Msg || '上传背景图失败',
          hasMask: false,
          duration: 1000,
        });
        this.setState({
          isUploadBackgroundUrl: false,
        });
      });
  };

  // 点击编辑签名
  handleClickSignature = () => {
    this.setState({
      isClickSignature: !this.state.isClickSignature,
    });
  };

  // 签名change事件
  handleChangeSignature = (e) => {
    this.props.user.editSignature = e.target.value;
  };

  handleBlurSignature = (e) => {
    this.props.user.editSignature = e.target.value;
    this.setState({
      isClickSignature: false,
    });
  };

  render() {
    const { isUploadAvatarUrl, isUploadBackgroundUrl } = this.state;
    return (
      <>
        <div className={styles.userCenterEditHeader}>
          <div className={styles.bgContent} style={{ position: 'relative' }}>
            <UserCenterHeaderImage onClick={this.handleBackgroundUpload} />
            <input
              onChange={this.onBackgroundChange}
              ref={this.backgroundUploaderRef}
              type="file"
              style={{ display: 'none' }}
              accept={USER_IMAGE_TYPES.join(',')}
            />
            {/* 背景图加载状态 */}
            {isUploadBackgroundUrl && (
              <div className={styles.uploadBgUrl}>
                <Icon name="UploadingOutlined" size={12} />
                <span className={styles.uploadText}>上传中...</span>
              </div>
            )}
          </div>
          <div className={styles.headImgBox}>
            <Avatar image={this.user.avatarUrl} size="big" name={this.user.nickname} />
            {/* 相机图标 */}
            <div className={styles.userCenterEditCameraIcon} onClick={this.handleAvatarUpload}>
              <Icon name="CameraOutlined" />
              <input
                onChange={this.onAvatarChange}
                ref={this.avatarUploaderRef}
                type="file"
                style={{ display: 'none' }}
                multiple={false}
                accept={USER_IMAGE_TYPES.join(',')}
              />
            </div>
            {/* 上传中样式处理 */}
            {isUploadAvatarUrl && (
              <div className={styles.uploadAvatar}>
                <Icon name="UploadingOutlined" size={12} />
                <span className={styles.uploadText}>上传中...</span>
              </div>
            )}
          </div>
          {/* 编辑修改说明 */}
          <div className={styles.userCenterEditDec}>
            <div onClick={this.handleClickSignature} className={styles.userCenterEditDecItem}>
              <Icon name="CompileOutlined" />
              {this.state.isClickSignature ? (
                // true ? (
                <Input
                  className={styles.userSignatureInput}
                  maxLength={50}
                  focus={true}
                  onChange={this.handleChangeSignature}
                  onBlur={this.handleBlurSignature}
                  value={this.user.editSignature}
                  placeholder="这个人很懒，什么也没留下~"
                />
              ) : (
                <span className={styles.text}>{this.user.editSignature || '这个人很懒，什么也没留下~'}</span>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
