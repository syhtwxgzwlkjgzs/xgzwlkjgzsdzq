import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import UserCenterHeaderImage from '@components/user-center-header-images';
import Icon from '@discuzq/design/dist/components/icon/index';
import Input from '@discuzq/design/dist/components/input/index';
import { inject, observer } from 'mobx-react';
import { ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';
import { View, Text } from '@tarojs/components';
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
      isClickSignature: false,
    };
    this.config = getConfig();
    this.user = this.props.user || {};
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

  uploadAvatarImpl = async (fileList) => {
    const token = locals.get(constants.ACCESS_TOKEN_NAME);
    const uploadRes = await Taro.uploadFile({
      url: `${this.config.COMMOM_BASE_URL}/apiv3/users/avatar`,
      filePath: fileList[0].path,
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
          duration: 2000
        });
      } else {
        Toast.error({
          content: parsedData.Message,
          duration: 2000
        })
      }
    } catch (e) {
      console.log(e);
      Toast.error({
        content: '解析失败',
        duration: 2000
      })
    }
  };

  uploadBackgroundImpl = async (fileList) => {
    const token = locals.get(constants.ACCESS_TOKEN_NAME);
    const uploadRes = await Taro.uploadFile({
      url: `${this.config.COMMOM_BASE_URL}/apiv3/users/background`,
      filePath: fileList[0].path,
      header: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${token}`,
      },
      name: 'background',
    });
    console.log(uploadRes.data)
  }

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
            {this.state.isClickSignature ? (
              <View className={styles.text}>
                <Input
                  maxLength={20}
                  focus={true}
                  onChange={this.handleChangeSignature}
                  onBlur={this.handleBlurSignature}
                  value={this.user.editSignature}
                  placeholder="这个人很懒，什么也没留下~"
                />
              </View>
            ) : (
              <Text className={styles.text}>{this.user.editSignature || '这个人很懒，什么也没留下~'}</Text>
            )}
          </View>
        </View>
      </>
    );
  }
}
