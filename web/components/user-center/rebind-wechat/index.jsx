import React, { Component } from 'react';
import styles from './index.module.scss';
import { Avatar, Input, Icon, Dialog, Toast, Button } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';

@inject('user')
@observer
class WechatRebindDialog extends Component {
  // TODO: 完善这部分
  async componentDidMount() {
    await this.props.user.genRebindQrCode({
      scanSuccess: this.handleScanSuccess,
      scanFail: this.handleScanFail,
    });
  }

  handleScanSuccess = async () => {
    Toast.success({
      content: '换绑成功',
      duration: 1000,
    });
    console.log('scan success');
  };

  handleScanFail = async () => {
    Toast.error({
      content: '换绑失败',
      duration: 1000,
    });
    console.log('scan fail');
  };

  render() {
    return (
      <Dialog visible={this.props.visible} maskClosable onClose={this.props.onClose}>
        <div className={styles.wechatRebindContent}>
          <div className={styles.title}>
            微信换绑
            <Icon onClick={this.props.onClose} name="CloseOutlined" />
          </div>
        </div>
        <div>
          <div>
            <img src={this.props.user.rebindQRCode} />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default WechatRebindDialog;
