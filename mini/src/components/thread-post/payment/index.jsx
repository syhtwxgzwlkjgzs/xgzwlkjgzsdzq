
import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Button, Input, Slider } from '@discuzq/design';
import { THREAD_TYPE } from '@common/constants/thread-post';
import throttle from '@common/utils/thottle';

import styles from './index.module.scss';

const Paid = inject('threadPost')(observer((props) => {
  // props state
  const { params: { paidType } } = getCurrentInstance().router;
  const isPost = parseInt(paidType) === THREAD_TYPE.paidPost; // 是否是全贴付费
  const [price, setPrice] = useState(''); // 全贴价格\附件价格
  const [freeWords, setFreeWords] = useState(1); // 免费查看百分比
  const [refresh, setRefresh] = useState(true); // 手动刷新页面

  // Hook
  useEffect(() => { // 初始化
    const { postData } = props.threadPost;
    if (isPost) {
      postData.price && setPrice(postData.price);
      setFreeWords(postData.freeWords * 100);
    } else {
      postData.attachmentPrice && setPrice(postData.attachmentPrice);
    }
  }, [])

  // handle
  const handlePrice = (val) => {
    const arr = val.match(/([1-9]\d{0,6}|0)(\.\d{0,2})?/);
    setPrice(arr ? arr[0] : '');
    setRefresh(!refresh);
  }

  const checkState = () => {
    if (!price) {
      Taro.showToast({ title: '请输入付费金额', icon: 'none', duration: 2000 })
      return false;
    }

    if (parseFloat(price) < 0.1) {
      Taro.showToast({ title: '付费金额最低0.1元', icon: 'none', duration: 2000 })
      return false;
    }

    if (parseFloat(price) > 1000000) {
      Taro.showToast({ title: '付费金额最高1000000元', icon: 'none', duration: 2000 })
      return false;
    }

    return true;
  }

  const paidCancel = () => { // 取消、返回发帖页
    Taro.navigateBack();
  }

  const paidConfirm = () => { // 确认
    // 1 校验
    if (!checkState()) return;

    // 2 update store
    const { setPostData } = props.threadPost;
    if (isPost) {
      setPostData({ price: parseFloat(price), freeWords: freeWords / 100 });
    } else {
      setPostData({ attachmentPrice: parseFloat(price) });
    }

    // 3 go back
    paidCancel();
  };

  const postComponent = () => {
    return (
      <>
        <View className={styles['paid-item']}>
          <View className={styles.left}>支付金额</View>
          <View className={styles.right}>
            <Input
              mode="number"
              value={price}
              placeholder="金额"
              maxLength={10}
              onChange={e => handlePrice(e.target.value)}
            />&nbsp;元
          </View>
        </View>
        <View className={styles.free}>
          <View className={styles['free-title']}>免费查看字数</View>
          <Slider
            value={freeWords}
            defaultValue={freeWords}
            formatter={value => `${value} %`}
            onChange={throttle(e => setFreeWords(e), 100)}
          />
        </View>
      </>
    )
  }

  const attachmentComponent = () => {
    return (
      <View className={styles['paid-item']}>
        <View className={styles.left}>附件内容查看价格</View>
        <View className={styles.right}>
          <Input
            mode="number"
            value={price}
            placeholder="金额"
            maxLength={10}
            onChange={e => handlePrice(e.target.value)}
          />&nbsp;元
        </View>
      </View>
    )
  }

  return (
    <View className={styles.wrapper}>
      {/* content */}
      {isPost ? postComponent() : attachmentComponent()}
      {/* button */}
      <View className={styles.btn}>
        <Button onClick={paidCancel}>取消</Button>
        <Button className={styles['btn-confirm']} onClick={paidConfirm}>确定</Button>
      </View>
    </View>
  );
}))

export default Paid;

