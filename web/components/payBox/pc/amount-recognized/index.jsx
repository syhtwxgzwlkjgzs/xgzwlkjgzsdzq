import React, { Component } from 'react';
import styles from './index.module.scss';
import { Dialog, Button, Checkbox } from '@discuzq/design';
import CommonAccountContent from '../../components/common-account-content';
import { inject } from 'mobx-react';

@inject('payBox')
export default class index extends Component {

  componentDidMount() {
    console.log(this.props.payBox)
  }

  onCloseBtn = () => {
    this.setState({
      isShow: false,
    });
  };

  goToThePayConfirmPage = async () => {
    try {
      await this.props.payBox.createOrder()
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { options = {} } = this.props.payBox
    return (
      <div>
        <>
          <div className={styles.amountWrapper}>
            <CommonAccountContent currentPaymentData={options} />
            <hr className={styles.acExplain_hr}/>
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
        </>
      </div>
    );
  }
}
