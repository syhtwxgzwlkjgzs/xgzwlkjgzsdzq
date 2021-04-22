import React, { Component } from 'react';
import styles from './index.module.scss';
import { Dialog, Button, Checkbox } from '@discuzq/design';
import CommonAccountContent from '../../components/common-account-content';

export default class index extends Component {
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
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isShow: true,
      });
    }, 1000);
  }

  onCloseBtn = () => {
    this.setState({
      isShow: false,
    });
  };

  render() {
    const { currentPaymentObj = {} } = this.state;
    return (
      <div>
        <Dialog visible={this.state.isShow} position="center" maskClosable={true}>
          <div className={styles.amountWrapper}>
            <CommonAccountContent currentPaymentObj={currentPaymentObj} />
            <hr />
            {/* 按钮区域-提交内容 */}
            <div className={styles.amountSubmit}>
              <span>合计：￥ 9.90 元</span>
              <Button type="primary" onClick={this.goToThePayConfirmPage} size="large" className={styles.asBtn}>
                确认支付
              </Button>
            </div>
            {/* 关闭按钮 */}
            <div onClick={this.onCloseBtn} className={styles.amountCloseBtn}>
              X
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}
