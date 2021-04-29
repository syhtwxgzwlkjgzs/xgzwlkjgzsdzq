import React, { useState } from 'react';
import { Toast, Popup, Button, Input } from '@discuzq/design';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel, rewardAmount } = props;


  const [value, setValue] = useState('');
  const [moneyNum, setMoneyNum] = useState('');

  let valueNum = null;
  const onInputChange = (val) => {
    valueNum = Number(val);
    console.log(valueNum);
    if (valueNum >= 0 && valueNum <= 100) {
      setValue(valueNum);
      setMoneyNum(valueNum * 0.01 * rewardAmount);
    } else {
      setMoneyNum(0);
      Toast.success({
        content: '请输入0-100',
      });
    }
  };

  const onSubmitClick = async () => {
    if (typeof onOkClick === 'function') {
      try {
        const success = await onOkClick(moneyNum);
        if (success) {
          setValue('');
          setMoneyNum('');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Popup position="bottom" visible={visible} onClose={onCancel}>
      <View className={styles.container}>
        <View className={styles.header}>采纳回复悬赏</View>
        <View className={styles.body}>
          <View className={styles.percentage}>
            <View className={styles.text}>悬赏百分比:</View>
            <Input
              mode='number'
              className={styles.input}
              value={value}
              maxLength={3}
              onChange={e => onInputChange(e.target.value)}
            />
            <View className={styles.text}>%</View>
          </View>
          <View className={styles.rewardMoney}>
            <View className={styles.text}>悬赏金额:</View>
            <Input mode='number' className={styles.input} value={moneyNum} disabled />
          </View>
        </View>
        <View className={styles.button}>
        <Button full onClick={onSubmitClick} className={styles.ok} type="primary" size="large">
          确定
        </Button>
        <Button full onClick={onCancel} className={styles.cancel} type="primary" size="large">
          取消
        </Button>
        </View>
        <View className={styles.blank}></View>
      </View>
    </Popup>
  );
};

export default InputPop;
