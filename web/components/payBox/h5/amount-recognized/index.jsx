import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup, Icon, Button, Checkbox } from '@discuzq/design';
import styles from './index.module.scss';
import CommonAccountContent from '../../components/common-account-content';

@inject('payBox')
@observer
export default class AmountRecognized extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      currentPaymentData: [
        {
          trade_type: '1', // 交易类型 1|2|3 帖子|打赏|付费加入
          goods_name: '帖子标题', // 商品名称
          pay_money: '9.90', // 支付金额
          is_anonymous: '1', // 是否匿名
        },
        {
          trade_type: '2',
          goods_name: '打赏的内容', // 商品名称
          pay_money: '19.90', // 支付金额
          is_anonymous: '0', // 是否匿名
        },
        {
          trade_type: '3',
          goods_name: '付费加入...', // 商品名称
          pay_money: '19.90', // 支付金额
          is_anonymous: '0', // 是否匿名
        }
      ],
    };
  }

  renderDiffTradeType = (type) => {
    let value = '';
    switch (type) {
      case '1': // 表示付费贴
        value = '付费帖';
        break;
      case '2': // 表示打赏
        value = '打赏';
        break;
      case '3':
        value = '表示付费加入';
        break;
      default:
        break;
    }
    return value;
  };

  // 点击支付去到
  goToThePayConfirmPage = () => {};

  render() {
    const { currentPaymentData = [] } = this.state;
    return (
      <Popup
        position="bottom"
        maskClosable={true}
        visible={this.props.payBox.options.visible}
        onClose={() => {
          this.props.payBox.options.visible = false;
        }}
      >
        <div className={styles.amountWrapper}>
          <CommonAccountContent currentPaymentData={currentPaymentData} />
          {/* 按钮区域-提交内容 */}
          <div className={styles.amountSubmit}>
            <Button type="primary" onClick={this.goToThePayConfirmPage} size="large" className={styles.asBtn} full>
              支付 ￥...
            </Button>
          </div>
        </div>
      </Popup>
    );
  }
}
