import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import CommonAccountContent from '../../components/common-account-content';
import { Toast } from '@discuzq/design';
import { STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';

@inject('payBox')
@observer
export default class AmountRecognized extends Component {

  onClose = () => {
    // FIXME: 延时回调的修复
    this.props.payBox.visible = false
    this.props.payBox.clear();
  }
  

  // 点击支付去到 选择支付方式页面
  goToThePayConfirmPage = async () => {
    try {
      await this.props.payBox.createOrder();
    } catch (error) {
      Toast.error({
        content: error.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };

  // 确认金额内容
  renderAmountRecognizedContent = () => {
    const { options = {} } = this.props.payBox;
    const { amount } = options;
    return (
      <div className={styles.amountWrapper}>
        <CommonAccountContent currentPaymentData={options} />
        {/* 按钮区域-提交内容 */}
        <div className={styles.amountSubmit}>
          <Button type="primary" onClick={this.goToThePayConfirmPage} size="large" className={styles.asBtn} full>
            支付 ￥{amount}
          </Button>
        </div>
        {/* 关闭按钮 */}
        <div className={styles.payBoxCloseIcon} onClick={this.onClose}>
          <Icon name="CloseOutlined" size={14} />
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.renderAmountRecognizedContent()}</div>;
  }
}
