import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import { Button, View, Text, Checkbox } from '@tarojs/components';
import PayConfirmed from '../pay-confirmed/index';
import { ORDER_TRADE_TYPE } from '../../../../../common/constants/payBoxStoreConstants';
@inject('payBox')
@observer
export default class AmountRecognized extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotShowTitle: false,
      titleName: '确认金额',
    };
  }

  componentDidMount() {}

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
        value = '付费提问';
        break;
      default:
        break;
    }
    return value;
  };

  // 点击支付去到
  goToThePayConfirmPage = () => {};

  renderContent = () => {
    const { isNotShowTitle, titleName } = this.state;
    const { options = {} } = this.props.payBox;
    const { type, amount, isAnonymous } = options;
    return (
      <>
        {/* 标题 */}
        {!isNotShowTitle && <View className={styles.amountTitle}>{titleName || '确认金额'}</View>}
        {/* 主要内容区域 */}
        <View className={styles.amountContent}>
          <>
            <View className={styles.acExplain}>
              <Text className={styles.acExplain_label}>交易类型</Text>{' '}
              <Text className={styles.acExplain_value}>{this.renderDiffTradeType(type)}</Text>
            </View>
            <View className={styles.acExplain}>
              <Text className={styles.acExplain_label}>商品名称</Text>{' '}
              <Text className={styles.acExplain_value}>{'暂未设置'}</Text>
            </View>
            <View className={styles.acExplain}>
              <Text className={styles.acExplain_label}>支付金额</Text>
              <Text>￥{amount}</Text>
            </View>
            {type === ORDER_TRADE_TYPE.REGEISTER_SITE && (
              <View className={styles.acExplain}>
                <Checkbox style={{ verticalAlign: 'middle' }} checked={isAnonymous} />
                <Text style={{ verticalAlign: 'middle' }}>隐藏我的付费信息</Text>
              </View>
            )}
            {type == ORDER_TRADE_TYPE.COMBIE_PAYMENT && (
              <View>
                <View className={styles.acExplain_hr} />
              </View>
            )}
          </>
        </View>
      </>
    );
  };

  render() {
    const { options = {} } = this.props.payBox;
    const { amount } = options;
    return (
      <View className={styles.amountWrapper}>
        {this.renderContent()}
        {/* 按钮区域-提交内容 */}
        <View className={styles.amountSubmit}>
          <Button type="primary" className={styles.asBtn}>
            支付 ￥{amount}
          </Button>
        </View>
      </View>
    );
  }
}
