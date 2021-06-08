import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import UserCenterHeaderImage from '@components/user-center-header-images';
import Icon from '@discuzq/design/dist/components/icon/index';
import Input from '@discuzq/design/dist/components/input/index';
import { inject, observer } from 'mobx-react';
import { ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';
import { View, Text, Canvas } from '@tarojs/components';
import locals from '@common/utils/local-bridge';
import getConfig from '@common/config';
import constants from '@common/constants';
import Toast from '@discuzq/design/dist/components/toast';

@inject('user')
@observer
export default class index extends Component {
  config = {};

  constructor(props) {
    super(props);
    this.state = {
      isClickSignature: false, // 是否点击签名
      isUploadAvatarUrl: false, // 是否上传头像
      isUploadBackgroundUrl: false, // 是否上传背景图片
      inputWidth: '100%',
      canvasHeight: 0,
      canvasWidth: 0,
    }
    this.config = getConfig();
    this.user = this.props.user || {};
    this.hiddenElement = React.createRef();
  }

  handleAvatarUpload = () => {
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        this.onAvatarChange(res.tempFiles);
      },
    });
  };

  handleBackgroundUpload = () => {
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        this.onBackgroundChange(res.tempFiles);
      },
    });
  };

  getCanvasImg = async (file) => {
    const imgInfo = await Taro.getImageInfo({
      src: file.path,
    });
    const canvasContext = Taro.createCanvasContext('photoCanvas', this.$scope);
    let canvasHeight, canvasWidth;
    if (imgInfo && imgInfo.orientation) {
      const { width, height } = imgInfo;
      canvasHeight = height;
      canvasWidth = width;

      this.setState({
        canvasHeight,
        canvasWidth,
      });

      const img = file.path;

      switch (imgInfo.orientation) {
        case 'down':
          canvasWidth = width;
          canvasHeight = height;
          //需要旋转180度
          this.setState({
            canvasWidth: width,
            canvasHeight: height,
          });
          canvasContext.translate(width / 2, height / 2);
          canvasContext.rotate((180 * Math.PI) / 180);
          canvasContext.drawImage(img, -width / 2, -height / 2, width, height);
          break;
        case 'left':
          canvasWidth = width;
          canvasHeight = height;
          canvasContext.translate(height / 2, width / 2);
          this.setState({
            canvasWidth: height,
            canvasHeight: width,
          });
          //顺时针旋转270度
          canvasContext.rotate((270 * Math.PI) / 180);
          canvasContext.drawImage(img, -width / 2, -height / 2, width, height);
          break;
        case 'right':
          // canvasWidth = width;
          // canvasHeight = height;
          // this.setState({
          //   canvasWidth: height,
          //   canvasHeight: width,
          // });
          // canvasContext.translate(height / 2, width / 2);
          // //顺时针旋转90度
          // canvasContext.rotate((90 * Math.PI) / 180);
          // canvasContext.drawImage(img, -width / 2, -height / 2, width, height);
          canvasHeight = height;
          canvasWidth = width;
          canvasContext.drawImage(img, 0, 0);
          break;
        default:
          canvasHeight = height;
          canvasWidth = width;
          canvasContext.drawImage(img, 0, 0);
      }
    }

    const drawPromisify = () =>
      new Promise((resolve) => {
        canvasContext.draw(false, () => {
          Taro.canvasToTempFilePath({
            canvasId: 'photoCanvas',
            width: canvasWidth,
            height: canvasHeight,
            destWidth: 1200,
            destHeight: 800,
            x: 0,
            y: 0,
            success: (res) => {
              resolve(res);
            },
            fail: (err) => {
              console.error('failed', err);

              Toast.error({
                content: '图像转换失败',
                duration: 2000
              })
            },
            onError: (err) => {
              console.error('error', err);

              Toast.error({
                content: '图像转换错误',
                duration: 2000
              })
            },
          });
        });
      });

    const res = await drawPromisify();

    return res;

  };

  uploadAvatarImpl = async (fileList) => {
    try {
      const token = locals.get(constants.ACCESS_TOKEN_NAME);
      const file = await this.getCanvasImg(fileList[0]);
      const uploadRes = await Taro.uploadFile({
        url: `${this.config.COMMOM_BASE_URL}/apiv3/users/avatar`,
        filePath: file.tempFilePath,
        header: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
        },
        name: 'avatar',
      });
      try {
        const parsedData = JSON.parse(uploadRes.data);
        console.log(parsedData);
        if (parsedData.Code === 0) {
          Toast.success({
            content: '上传成功',
            duration: 2000,
          });
          this.props.user.userInfo.avatarUrl = parsedData.Data.avatarUrl;
          this.props.user.userInfo = { ...this.props.user.userInfo };
        } else {
          Toast.error({
            content: parsedData.Message,
            duration: 2000,
          });
        }
      } catch (e) {
        console.error(e);
        Toast.error({
          content: '解析失败',
          duration: 2000,
        });
      }
    } catch (e) {
      console.error(e);
      Toast.error({
        content: '上传失败，网络错误',
        duration: 2000,
      });
    }
  };

  uploadBackgroundImpl = async (fileList) => {
    try {
      const token = locals.get(constants.ACCESS_TOKEN_NAME);
      const file = await this.getCanvasImg(fileList[0]);
      const uploadRes = await Taro.uploadFile({
        url: `${this.config.COMMOM_BASE_URL}/apiv3/users/background`,
        filePath: file.tempFilePath,
        header: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
        },
        name: 'background',
      });
      try {
        console.log(uploadRes)
        const parsedData = JSON.parse(uploadRes.data);
        if (parsedData.Code === 0) {
          Toast.success({
            content: '上传成功',
            duration: 2000,
          });
          this.props.user.userInfo.backgroundUrl = parsedData.Data.backgroundUrl;
          this.props.user.userInfo = { ...this.props.user.userInfo };
        } else {
          Toast.error({
            content: parsedData.Message,
            duration: 2000,
          });
        }
      } catch (e) {
        console.log(e);
        Toast.error({
          content: '解析失败',
          duration: 2000,
        });
      }
    } catch (e) {
      console.log(e);
      Toast.error({
        content: '上传失败，网络错误',
        duration: 2000,
      });
    }
  };

  onAvatarChange = async (fileList) => {
    await this.uploadAvatarImpl(fileList);
  };

  onBackgroundChange = async (fileList) => {
    await this.uploadBackgroundImpl(fileList);
  };

  // 点击编辑签名
  handleClickSignature = () => {
    this.setState({
      isClickSignature: !this.state.isClickSignature,
      inputWidth: this.hiddenElement.current?.offsetWidth
    })
  }

  // 签名change事件
  handleChangeSignature = (e) => {
    this.props.user.editSignature = e.target.value;
    this.setState({
      inputWidth: this.hiddenElement.current?.offsetWidth
    })
  }

  handleBlurSignature = (e) => {
    this.props.user.editSignature = e.target.value;
    this.setState({
      isClickSignature: false,
    });
  };

  render() {
    const { isUploadAvatarUrl, isUploadBackgroundUrl, inputWidth } = this.state
    console.log(inputWidth);
    return (
      <>
        <View className={styles.userCenterEditHeader}>
          <UserCenterHeaderImage onClick={this.handleBackgroundUpload} />
          <View className={styles.headImgBox}>
            <Avatar image={this.user.avatarUrl} size="big" name={this.user.username} />
            {/* 相机图标 */}
            <View className={styles.userCenterEditCameraIcon} onClick={this.handleAvatarUpload}>
              <Icon name="CameraOutlined" />
            </View>
          </View>
          {/* 编辑修改说明 */}
          <View className={styles.userCenterEditDec}>
            <Icon onClick={this.handleClickSignature} name="CompileOutlined" />
          {
            this.state.isClickSignature ? (
              <View className={styles.text}><Input maxLength={50} focus={true} onChange={this.handleChangeSignature} onBlur={this.handleBlurSignature} value={this.user.editSignature} placeholder="这个人很懒，什么也没留下~" /></View>
            ) : (
              <Text className={styles.text}>{this.user.editSignature || '这个人很懒，什么也没留下~'}</Text>
            )
          }
          {/* 隐藏span--获取该内容宽度--赋值给input */}
          <View style={{ maxWidth: '80%' }} ref={this.hiddenElement} className={styles.hiddenElement}>{this.user.editSignature || '这个人很懒，什么也没留下~'}</View>
        </View>
        <Canvas
          type="33"
          canvasId={'photoCanvas'}
          style={{
            position: 'fixed',
            top: 0,
            zIndex: -10000,
            width: this.state.canvasWidth,
            height: this.state.canvasHeight,
          }}
        />
      </View>
      </>
    );
  }
}
