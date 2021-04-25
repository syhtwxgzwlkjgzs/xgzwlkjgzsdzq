import React, { Component } from 'react';
import { Popup, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import { Button, View, Text, Checkbox } from '@tarojs/components';
import PayConfirmed from '../pay-confirmed/index'

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
        },
      ],
      isNotShowTitle: false,
      titleName: '确认金额',
      isShow1: false
    };
  }

  componentDidMount() {
    console.log('进来了————挂载');
  }

  onClick = () => {
    console.log('进来了','ssssssssssss_111111111');
    this.setState({
      isShow: !this.state.isShow
    })
  }

  onClick1 = () => {
    this.setState({
      isShow1: !this.state.isShow1
    })
  }

  onClose = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }

  onClose1 = () => {
    this.setState({
      isShow1: !this.state.isShow1
    })
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

  renderContent = () => {
    const { currentPaymentData = [], isNotShowTitle, titleName } = this.state;
    return (
      <>
        {/* 标题 */}
        {!isNotShowTitle && <View className={styles.amountTitle}>{titleName}</View>}
        {/* 主要内容区域 */}
        <View className={styles.amountContent}>
          {currentPaymentData &&
            !!currentPaymentData.length &&
            currentPaymentData.map((item, index) => {
              let is_show_hr = currentPaymentData.length > 0 && index != currentPaymentData.length - 1;
              return (
                <>
                  <View className={styles.acExplain}>
                    <Text className={styles.acExplain_label}>交易类型</Text>{' '}
                    <Text className={styles.acExplain_value}>{this.renderDiffTradeType(item.trade_type)}</Text>
                  </View>
                  <View className={styles.acExplain}>
                    <Text className={styles.acExplain_label}>商品名称</Text>{' '}
                    <Text className={styles.acExplain_value}>{item.goods_name}</Text>
                  </View>
                  <View className={styles.acExplain}>
                    <Text className={styles.acExplain_label}>支付金额</Text>
                    <Text>￥{item.pay_money}</Text>
                  </View>
                  <View className={styles.acExplain}>
                    <Checkbox style={{verticalAlign:'middle'}} checked={item.is_anonymous == '1'} />
                    <Text style={{verticalAlign:'middle'}}>隐藏我的付费信息</Text>
                  </View>
                  {is_show_hr && (
                    <View>
                      <View className={styles.acExplain_hr} />
                    </View>
                  )}
                </>
              );
            })}
        </View>
      </>
    );
  };

  render() {
    const { isShow, isShow1 } = this.state;
    return (
      <View>
        <Button style={{marginTop: '50%'}} onClick={this.onClick}>点击弹出确认金额</Button>
        <Button onClick={this.onClick1}>点击弹出支付方式页面</Button>
        <Popup position="bottom" maskClosable={true} visible={isShow} onClose={this.onClose}>
          <View className={styles.amountWrapper}>
            {this.renderContent()}
            {/* 按钮区域-提交内容 */}
            <View className={styles.amountSubmit}>
              <Button type="primary" className={styles.asBtn} >
                支付 ￥...
              </Button>
            </View>
          </View>
        </Popup>
        <PayConfirmed visible={isShow1} onClose={this.onClose1}/>
      </View>
    );
  }
}
