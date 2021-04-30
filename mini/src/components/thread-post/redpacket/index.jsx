import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Radio, Input, Button } from '@discuzq/design';
import { observer, inject } from 'mobx-react';
import styles from './index.module.scss';


@inject('threadPost')
@observer
export default class Redpacket extends Component {
  constructor() {
    super();
    this.state = {
      rule: 1, // 发放规则 0-定额 1-随机
      price: '', // 红包金额
      number: '', //  红包个数
      condition: 0, // 获利条件 0-回复 1-集赞
      likenum: '' // 集赞个数
    };
  }

  componentDidMount() { // 回显
    const { redpacket } = this.props.threadPost.postData;
    if (Object.keys(redpacket).length > 0) {
      const { rule, price, number, condition, likenum } = redpacket;
      this.setState({ rule, price, number, condition, likenum })
    }
  }

  onPriceChang = (e) => { // 对红包金额做仅可输入两位小数的操作
    const val = e.target.value;
    const price = val.replace(/\.\d*$/, $1 => {
      return $1.slice(0, 3)
    })
    this.setState({ price })
  }

  redToast = (title) => { // toast
    Taro.showToast({ title, icon: 'none', duration: 2000 })
  }

  checkConfirm = () => { // 更新红包store前校验数据合法性
    const { price, number, condition, likenum } = this.state;

    if (!price) {
      this.redToast('请输入红包金额')
      return false;
    }

    if (price < 0.1 || price > 200) {
      this.redToast('可输入红包金额为0.1 ~ 200元')
      return false;
    }

    if (!number) {
      this.redToast('请输入红包个数');
      return false;
    }

    if (number < 1 || number > 200) {
      this.redToast('可输入红包个数为0.1 ~ 200个');
      return false;
    }

    if (condition === 1 && !likenum) {
      this.redToast('请输入点赞数');
      return false;
    }

    if (condition === 1 && likenum > 250) {
      this.redToast('可输入点赞数为1 ~ 250个');
      return false;
    }

    return true;
  }

  handleCancel = () => { // 取消红包
    Taro.navigateBack();
  }

  handleConfirm = () => { // 确认红包
    // 1 校验数据
    if (!this.checkConfirm()) return;

    // 2 更新store
    const { rule, price, number, condition, likenum } = this.state;
    const { setPostData } = this.props.threadPost;

    setPostData({
      redpacket: {
        rule,
        price: parseFloat(price),
        number: parseInt(number),
        condition,
        likenum: parseInt(likenum),
      }
    })

    // 3 返回上一页
    Taro.navigateBack();
  }

  render() {
    const { rule, price, number, condition, likenum } = this.state;

    return (
      <View className={styles.wrapper}>
        {/* 发放规则 */}
        <View className={styles['reward-item']}>
          <Text className={styles.left}>发放规则</Text>
          <View className={styles.right}>
            <Radio.Group value={rule} onChange={rule => this.setState({ rule })}>
              <Radio name={1}>随机</Radio>
              <Radio name={0}>定额</Radio>
            </Radio.Group>
          </View>
        </View>
        {/* 红包金额 */}
        <View className={styles['reward-item']}>
          <Text className={styles.left}>
            {rule === 1 ? '红包总金额' : '红包单个金额'}</Text>
          <View className={styles.right}>
            <Input
              value={price}
              mode="number"
              miniType="number"
              placeholder="金额"
              placeholderStyle="color:#c5c6ca"
              maxLength={6}
              onChange={this.onPriceChang}
            />元
          </View>
        </View>
        {/* 红包个数 */}
        <View className={styles['reward-item']}>
          <Text className={styles.left}>红包个数</Text>
          <View className={styles.right}>
            <Input
              value={number}
              mode="number"
              miniType="number"
              placeholder="个数"
              placeholderStyle="color:#c5c6ca"
              maxLength={3}
              onChange={e => this.setState({ number: +e.target.value })}
            />个
          </View>
        </View>
        {/* 获利条件 */}
        <View className={styles['reward-item']}>
          <Text className={styles.left}>获利条件</Text>
          <View className={styles.right}>
            <Radio.Group
              value={condition}
              onChange={condition => this.setState({ condition })}
            >
              <Radio name={0}>回复领红包</Radio>
              <Radio name={1}>集赞领红包</Radio>
            </Radio.Group>
          </View>
        </View>
        {condition === 1 &&
          <View className={`${styles['reward-item']} ${styles.like}`}>
            <View className={styles.right}>
              <Input
                value={likenum}
                mode="number"
                miniType="number"
                placeholder="个数"
                placeholderStyle="color:#c5c6ca"
                maxLength={3}
                onChange={e => this.setState({ likenum: +e.target.value })}
              />个
            </View>
          </View>
        }
        {/* 按钮 */}
        <View className={styles.btn}>
          <Button onClick={this.handleCancel}>取消</Button>
          <Button className={styles['btn-confirm']} onClick={this.handleConfirm}>确定</Button>
        </View>

      </View>
    );
  }
}
