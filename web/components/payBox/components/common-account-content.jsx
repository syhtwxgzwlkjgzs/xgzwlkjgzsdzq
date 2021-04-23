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
    const { currentPaymentData = [], isNotShowTitle, titleName } = this.props;
    return (
      <>
        {/* 标题 */}
        {!isNotShowTitle && <div className={styles.amountTitle}>{titleName}</div>}
        {/* 主要内容区域 */}
        <div className={styles.amountContent}>
          {currentPaymentData &&
            !!currentPaymentData.length &&
            currentPaymentData.map((item, index) => {
              let is_show_hr = currentPaymentData.length > 0 && index != currentPaymentData.length - 1;
              return (
                <>
                  <div className={styles.acExplain}>
                    <span className={styles.acExplain_label}>交易类型</span>{' '}
                    <span className={styles.acExplain_value}>{this.renderDiffTradeType(item.trade_type)}</span>
                  </div>
                  <div className={styles.acExplain}>
                    <span className={styles.acExplain_label}>商品名称</span>{' '}
                    <span className={styles.acExplain_value}>{item.goods_name}</span>
                  </div>
                  <div className={styles.acExplain}>
                    <span className={styles.acExplain_label}>支付金额</span>
                    <span>￥{item.pay_money}</span>
                  </div>
                  <div className={styles.acExplain}>
                    <Checkbox checked={item.is_anonymous == '1'} /> 隐藏我的付费信息
                  </div>
                  {is_show_hr && (
                    <div>
                      <hr className={styles.acExplain_hr}/>
                    </div>
                  )}
                </>
              );
            })}
        </div>
      </>
    );
  }
}

CommonAccountContent.defaultProps = {
  currentPaymentData: [], // 当前支付对象
  isNotShowTitle: false, // 是否不显示title标题
  titleName: '确认金额', // 默认交易金额title标题名称
};
