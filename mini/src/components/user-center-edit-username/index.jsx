import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Input from '@discuzq/design/dist/components/input/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Router from '@discuzq/sdk/dist/router';
import styles from './index.module.scss';
import { View } from '@tarojs/components';

@inject('user')
@observer
export default class index extends Component {
  handleChangeNewUserName = (e) => {
    this.props.user.editUserName = e.target.value;
  };

  handleSubmit = async () => {
    try {
      await this.props.user.updateUsername();
      Toast.success({
        content: '修改用户名成功',
        duration: 1000
      })
      this.props.user.userInfo.username = this.props.user.editUserName;
      setTimeout(() => {
        Taro.navigateTo({url: '/subPages/my/index'})
      }, 1000);
    } catch (err) {
      if (err.Code) {
        Toast.error({
          content: err.Msg || "修改失败",
          duration: 1000
        });
      }
    }
  };

  render() {
    const { user } = this.props;
    const { editUserName } = user;
    return (
      <View id={styles.resetUserName}>
        <View className={styles.content}>
          <View className={styles.setTitle}>设置新用户名</View>
          <View className={styles.labelInfo}>
            <View className={styles.labelValue}>
              <Input
                value={editUserName}
                onChange={this.handleChangeNewUserName}
                placeholder="请输入新用户名"
                maxLength={30}
                trim
              />
            </View>
          </View>
        </View>
        <View className={styles.bottom}>
          <Button disabled={!editUserName} full onClick={this.handleSubmit} type={'primary'} className={styles.btn}>
            提交
          </Button>
        </View>
      </View>
    );
  }
}
