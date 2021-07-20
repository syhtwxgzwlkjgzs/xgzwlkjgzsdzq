import React, { Component } from 'react';
import Taro, { getCurrentInstance, redirectTo, navigateTo  } from '@tarojs/taro';
import { View, Text, Navigator } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Button from '@discuzq/design/dist/components/button/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import Page from '@components/page';
import { get } from '@common/utils/get';
import LoginHelper from '@common/utils/login-helper';
import HomeHeader from '@components/home-header';
import styles from './index.module.scss';
import { getParamCode, getUserProfile } from '../../../subPages/user/common/utils';
// const MemoToastProvider = React.memo(ToastProvider);

@inject('site')
@inject('miniBind')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WXRebindActionPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentStatus: '',
      statusInfo: {
        success: '扫码成功',
        error: '扫码失败'
      }
    };
  }

  render() {
    const { commonLogin } = this.props;
    const { currentStatus, statusInfo } = this.state;
    const { nickname = '' } = getCurrentInstance()?.router?.params || commonLogin;
    if (currentStatus) {
      return (
        <Page>
          <HomeHeader hideInfo hideMinibar mode="supplementary"/>
          <View className={styles.container}>
            <View className={`${styles.content} ${styles.statusContent}` }>
                { currentStatus === 'success' && <Icon color='#3AC15F' name="SuccessOutlined" size={80} className={styles.statusIcon} /> }
                { currentStatus === 'error' && <Icon color='#E02433' name="WrongOutlined" size={80} className={styles.statusIcon} /> }
                <Text className={styles.statusBottom}>{ currentStatus && (currentStatus === 'success' ? statusInfo.success : statusInfo.error) }</Text>
            </View>
          </View>
        </Page>
      );
    }

    return (
      <Page>
        <HomeHeader hideInfo hideMinibar mode="supplementary"/>
        <View className={styles.container}>
          <View className={styles.content}>
            <View className={styles.title}>确认换绑微信</View>
            <View className={styles.tips}>
              <View style={{display: 'flex' }}>亲爱的，<Avatar style={{margin: '0 8px'}} circle size='small' image={commonLogin.avatarUrl}/>{nickname}</View>
              <View>确认换绑微信？</View>
            </View>
            {
              this.props.h5QrCode.isBtn
              ? <Button
                className={styles.button}
                type="primary"
                onClick={() => {}}
              >
                确认
              </Button>
              : <></>
            }
          </View>
        </View>
      </Page>
    );
  }
}

export default WXRebindActionPage;
