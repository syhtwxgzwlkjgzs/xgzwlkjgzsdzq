import React, { Component } from 'react';
import styles from './index.module.scss';
import { Checkbox } from '@discuzq/design';

export default class CommonAccountContent extends Component {
  /**
   * 渲染不同交易类型
   * @param {String} type
   * @returns 返回对应交易类型名称
   */
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

  render() {
    const { currentPaymentObj = {}, isNotShowTitle, titleName } = this.props;
    const { trade_type, goods_name, is_anonymous, pay_money } = currentPaymentObj;
    return (
      <>
        {/* 标题 */}
        {!isNotShowTitle && <div className={styles.amountTitle}>{titleName}</div>}
        {/* 主要内容区域 */}
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
      </>
    );
  }
}

CommonAccountContent.defaultProps = {
  currentPaymentObj: {}, // 当前支付对象
  isNotShowTitle: false, // 是否不显示title标题
  titleName: '确认金额', // 默认交易金额title标题名称
};
