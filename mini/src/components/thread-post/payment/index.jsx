
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
  const [price, setPrice] = useState(''); // 全贴价格
  const [freeWords, setFreeWords] = useState(1); // 免费查看百分比
  const [attachmentPrice, setAttachmentPrice] = useState(''); // 附件价格

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
  const checkState = () => {
    if ((isPost && !price) || (!isPost && !attachmentPrice)) {
      Taro.showToast({
        title: '付费金额必须大于0元',
        icon: 'none',
        duration: 2000,
      })
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
      setPostData({ price, freeWords: freeWords / 100 });
    } else {
      setPostData({ attachmentPrice });
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
              onChange={e => setPrice(+e.target.value)}
            />元
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
            value={attachmentPrice}
            placeholder="金额"
            onChange={e => setAttachmentPrice(+e.target.value)}
          />元
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

