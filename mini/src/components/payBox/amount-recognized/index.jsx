import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Toast, Button, Divider } from '@discuzq/design';
import styles from './index.module.scss';
import { View, Text, Checkbox } from '@tarojs/components';
import { ORDER_TRADE_TYPE } from '../../../../../common/constants/payBoxStoreConstants';

@inject('payBox')
@observer
export default class AmountRecognized extends Component {

  onClose = () => {
    // FIXME: 延时回调的修复
    this.props.payBox.visible = false
    setTimeout(() => {
      this.props.payBox.clear();
    },1000)
  }

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

  handleChangeIsAnonymous = (checked) => {
    this.props.payBox.isAnonymous = checked
  }

  renderContent = () => {
    const { options = {} } = this.props.payBox;
    const { type, amount, isAnonymous } = options;
    return (
      <>
        {/* 标题 */}
        <View className={styles.amountTitle}>确认金额</View>
        {/* 主要内容区域 */}
        <View className={styles.amountContent}>
          <>
            <View className={styles.acExplain}>
              <Text className={styles.acExplainLabel}>交易类型</Text>{' '}
              <Text className={styles.acExplainValue}>{this.renderDiffTradeType(type)}</Text>
            </View>
            <Divider className={styles.acExplainDivider} />
            <View className={styles.acExplain}>
              <Text className={styles.acExplainLabel}>商品名称</Text>{' '}
              <Text className={styles.acExplainValue}>{'暂未设置'}</Text>
            </View>
            <Divider className={styles.acExplainDivider} />
            <View className={styles.acExplain}>
              <Text className={styles.acExplainLabel}>支付金额</Text>
              <Text className={styles.acExplainNum}>￥{amount}</Text>
            </View>
            {
              type === ORDER_TRADE_TYPE.REGEISTER_SITE && 
              (
                <View className={styles.acExplain}>
                  <Checkbox style={{ verticalAlign: 'middle', marginRight: 8 }} checked={this.props.payBox.isAnonymous} onChange={this.handleChangeIsAnonymous} />
                  <Text style={{ verticalAlign: 'middle' }}>隐藏我的付费信息</Text>
                </View>
              )}
            <Divider className={styles.acExplainDivider} />
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
          <Button onClick={this.goToThePayConfirmPage} type="primary" className={styles.asBtn} full>
            支付 ￥{amount}
          </Button>
        </View>
        {/* 关闭按钮 */}
        <View onClick={this.onClose} className={styles.payBoxCloseIcon}>
          <Icon name="PaperClipOutlined" size={16} />
        </View>
      </View>
    );
  }
}
