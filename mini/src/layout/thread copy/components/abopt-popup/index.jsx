import React, { useState } from 'react';
import { Popup, Button, Slider } from
import Popup from '@discuzq/design/dist/components/popup/index';
import Popup from '@discuzq/design/dist/components/popup/index';
import Popup from '@discuzq/design/dist/components/popup/index';
import throttle from '@common/utils/thottle';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel, rewardAmount } = props;

  const [data, setData] = useState(0);
  const [moneyNum, setMoneyNum] = useState(0);

  const onInputChange = (val) => {
    console.log(val);
    setData(val);
    setMoneyNum(Number(val) * 0.01 * rewardAmount);
  };

  const onSubmitClick = async () => {
    if (typeof onOkClick === 'function') {
      try {
        const success = await onOkClick(moneyNum);
        if (success) {
          setMoneyNum(0);
          setData(0);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Popup position="bottom" visible={visible} onClose={onCancel}>
      <View className={styles.container}>
        <View className={styles.main}>
          <View className={styles.header}>采纳回复悬赏</View>
          <View className={styles.body}>
            <View className={styles.percentage}>
              <View className={styles.text}>悬赏百分比:</View>
              <View className={styles.slider}>
                <Slider
                  value={data}
                  defaultValue={data}
                  formatter={value => `${value} %`}
                  onChange={throttle(e => onInputChange(e), 500)}
                />
              </View>
            </View>
            <View className={styles.rewardMoney}>
              <View className={styles.text}>悬赏金额</View>
              <View className={styles.text}>{moneyNum}元</View>
            </View>
          </View>
        </View>
        <View className={styles.button}>
          <Button full onClick={onCancel} className={styles.cancel} type="text" size="medium">
            取消
          </Button>
          <Button full onClick={onSubmitClick} className={styles.ok} type="primary" size="medium">
            确定
          </Button>
        </View>
      </View>
    </Popup>
  );
};

export default InputPop;
