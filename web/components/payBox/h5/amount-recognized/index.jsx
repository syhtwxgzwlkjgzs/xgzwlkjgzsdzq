import React, { Component } from 'react';
import { Popup, Icon, Button, Checkbox } from '@discuzq/design';
import styles from './index.module.scss';

export default class AmountRecognized extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      currentPaymentObj: {
        trade_type: '1', // 交易类型 1|2|3 帖子|打赏|付费加入
        goods_name: '帖子标题', // 商品名称
        pay_money: '9.90', // 支付金额
        is_anonymous: '1', // 是否匿名
      },
      // {
      //   trade_type: '2',
      //   goods_name: '打赏的内容', // 商品名称
      //   pay_money: '19.90', // 支付金额
      //   is_anonymous: '0', // 是否匿名
      // },
      // {
      //   trade_type: '3',
      //   goods_name: '付费加入...', // 商品名称
      //   pay_money: '19.90', // 支付金额
      //   is_anonymous: '0', // 是否匿名
      // },
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isShow: true,
      });
    }, 1000);
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
  goToThePayConfirmPage = () => {

  }

  render() {
    const { currentPaymentObj = {} } = this.state;
		const { trade_type,goods_name,is_anonymous,pay_money } = currentPaymentObj
    return (
      <Popup position="bottom" maskClosable={true} visible={this.state.isShow}>
        <div className={styles.amountWrapper}>
          {/* 标题 */}
          <div className={styles.amountTitle}>确认金额</div>
          {/* 内容区域 */}
          <div className={styles.amountContent}>
            <div className={styles.acExplain}>
              <span className={styles.acExplain_label}>交易类型</span>{' '}
              <span className={styles.acExplain_value}>{this.renderDiffTradeType(trade_type)}</span>
            </div>
            <div className={styles.acExplain}>
              <span className={styles.acExplain_label}>商品名称</span>{' '}
              <span className={styles.acExplain_value}>{goods_name}</span>
            </div>
            <div className={styles.acExplain}>
              <span className={styles.acExplain_label}>支付金额</span>
              <span>￥{pay_money}</span>
            </div>
            <div className={styles.acExplain}>
              <Checkbox checked={is_anonymous == '1'} /> 隐藏我的付费信息
            </div>
          </div>
          {/* 按钮区域-提交内容 */}
          <div className={styles.amountSubmit}>
            <Button onClick ={this.goToThePayConfirmPage} size="large" className={styles.asBtn} full>
              支付 ￥{pay_money}
            </Button>
          </div>
        </div>
      </Popup>
    );
  }
}
