import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { Checkbox, Divider } from '@discuzq/design';
import { ORDER_TRADE_TYPE } from '../../../../common/constants/payBoxStoreConstants';

@inject('site')
@inject('payBox')
@observer
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
      case ORDER_TRADE_TYPE.COMBIE_PAYMENT:
        value = '红包+悬赏'
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

  handleChangeIsAnonymous = (checked) => {
    this.props.payBox.isAnonymous = checked
  }

  render() {
    const { currentPaymentData = {} } = this.props;
    const { type, amount, isAnonymous, title } = currentPaymentData;
    const { platform } = this.props?.site;

    return (
      <>
        {/* 标题 */}
        <div className={styles.amountTitle} style={{ textAlign: platform === 'pc' ? 'center' : 'left' }}>确认金额</div>
        {/* 主要内容区域 */}
        <div className={styles.amountContent}>
          <div className={styles.acExplain}>
            <span className={styles.acExplainLabel}>交易类型</span>{' '}
            <span className={styles.acExplainValue}>{this.renderDiffTradeType(type)}</span>
            {/* {
              type === ORDER_TRADE_TYPE.COMBIE_PAYMENT && (
                <span></span>
              )
            } */}
          </div>
          <Divider className={styles.acExplainDivider} />
          <div className={styles.acExplain}>
            <span className={styles.acExplainLabel}>商品名称</span>{' '}
            <span className={styles.acExplainValue}>{title}</span>
          </div>
          <Divider className={styles.acExplainDivider} />
          <div className={styles.acExplain}>
            <span className={styles.acExplainLabel}>支付金额</span>
            <span className={styles.acExplainNum}>￥{this.transMoneyToFixed(amount)}</span>
          </div>
          {
            type === ORDER_TRADE_TYPE.REGEISTER_SITE &&
            (
              <div className={styles.acExplain}>
                <Checkbox checked={this.props.payBox.isAnonymous} onChange={this.handleChangeIsAnonymous} /> 隐藏我的付费信息
              </div>
            )}
          <Divider className={styles.acExplainDivider} />
        </div>
      </>
    );
  }
}

CommonAccountContent.defaultProps = {
  currentPaymentData: {}, // 当前支付对象
  isNotShowTitle: false, // 是否不显示title标题
};
