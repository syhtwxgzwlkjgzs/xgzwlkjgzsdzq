import React, { Component } from 'react';
import styles from './index.module.scss';
import { Checkbox } from '@discuzq/design';
import { ORDER_TRADE_TYPE } from '../../../../common/constants/payBoxStoreConstants';

export default class CommonAccountContent extends Component {
  /**
   * 渲染不同交易类型
   * @param {String} type
   * @returns 返回对应交易类型名称
   */
  renderDiffTradeType = (type) => {
    let value = '';
    switch (type) {
      case ORDER_TRADE_TYPE.THEME: // 表示付费贴
        value = '付费帖';
        break;
      case ORDER_TRADE_TYPE.POST_REWARD: // 表示打赏
        value = '打赏';
        break;
      case ORDER_TRADE_TYPE.REGEISTER_SITE:
        value = '表示付费加入';
        break;
      case ORDER_TRADE_TYPE.PUT_PROBLEM: // 付费提问
        value = '付费提问'
        break
      default:
        break;
    }
    return value;
  };

  // 转换金额小数
  transMoneyToFixed = (num) => {
    return Number(num).toFixed(2);
  };

  render() {
    const { currentPaymentData = {}, isNotShowTitle, titleName } = this.props;
    const { type, amount, isAnonymous } = currentPaymentData;
    return (
      <>
        {/* 标题 */}
        {!isNotShowTitle && <div className={styles.amountTitle}>{titleName}</div>}
        {/* 主要内容区域 */}
        <div className={styles.amountContent}>
          <div className={styles.acExplain}>
            <span className={styles.acExplain_label}>交易类型</span>{' '}
            <span className={styles.acExplain_value}>{this.renderDiffTradeType(type)}</span>
          </div>
          <div className={styles.acExplain}>
            <span className={styles.acExplain_label}>商品名称</span>{' '}
            <span className={styles.acExplain_value}>{'暂未设置'}</span>
          </div>
          <div className={styles.acExplain}>
            <span className={styles.acExplain_label}>支付金额</span>
            <span>￥{this.transMoneyToFixed(amount)}</span>
          </div>
          {type === ORDER_TRADE_TYPE.REGEISTER_SITE && (
            <div className={styles.acExplain}>
              <Checkbox checked={isAnonymous} /> 隐藏我的付费信息
            </div>
          )}
          {type == ORDER_TRADE_TYPE.COMBIE_PAYMENT && (
            <div>
              <hr className={styles.acExplain_hr} />
            </div>
          )}
        </div>
      </>
    );
  }
}

CommonAccountContent.defaultProps = {
  currentPaymentData: {}, // 当前支付对象
  isNotShowTitle: false, // 是否不显示title标题
  titleName: '确认金额', // 默认交易金额title标题名称
};
