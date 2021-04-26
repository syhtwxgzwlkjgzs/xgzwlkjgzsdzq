import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup, Icon, Button, Checkbox } from '@discuzq/design';
import styles from './index.module.scss';
import CommonAccountContent from '../../components/common-account-content';
import { Toast } from '@discuzq/design';
import PayConfirmed from '../pay-confirmed';
import { STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';

@inject('payBox')
@observer
export default class AmountRecognized extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 转换金额小数
  transMoneyToFixed = (num) => {
    return Number(num).toFixed(2);
  };

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
    const { options = {} } = this.props;
    const { amount } = options;
    return (
      <div className={styles.amountWrapper}>
        <CommonAccountContent currentPaymentData={options} />
        {/* 按钮区域-提交内容 */}
        <div className={styles.amountSubmit}>
          <Button type="primary" onClick={this.goToThePayConfirmPage} size="large" className={styles.asBtn} full>
            支付 ￥{this.transMoneyToFixed(amount)}
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Popup
        position="bottom"
        maskClosable={true}
        visible={this.props.payBox.visible}
        onClose={() => {
          this.props.payBox.visible = false;
        }}
      >
        {this.props.payBox.step === STEP_MAP.PAYWAY ? <PayConfirmed /> : this.renderAmountRecognizedContent()}
      </Popup>
    );
  }
}
