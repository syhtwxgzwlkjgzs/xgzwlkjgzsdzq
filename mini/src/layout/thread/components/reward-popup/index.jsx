import React, { useState } from 'react';
import Popup from '@discuzq/design/dist/components/popup/index';
import Button from '@discuzq/design/dist/components/button/index';
import Input from '@discuzq/design/dist/components/input/index';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import className from 'classnames';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel } = props;

  const [value, setValue] = useState('');

  const onInputChange = (val) => {
    setValue(val);
  };

  const rewardList = [1, 2, 5, 10, 20, 50, 88, 128];

  const onRewardClick = (item) => {
    setValue(item);
  };

  const onSubmitClick = async () => {
    if (typeof onOkClick === 'function') {
      try {
        const success = await onOkClick(value);
        if (success) {
          setValue('');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Popup position="bottom" visible={visible} onClose={onCancel}>
      <View className={styles.container}>
        <View className={styles.header}>支付作者继续创作</View>

        <View className={styles.rewardInput}>
          <Text className={styles.prepend}>支付金额</Text>
          <Input
            mode="number"
            placeholder="金额"
            className={styles.input}
            value={value}
            onChange={(e) => onInputChange(e.target.value)}
            placeholderClass={styles.inputPlaceholder}
          />
          <Text className={styles.append}>元</Text>
        </View>

        <View className={styles.rewardList}>
          {rewardList.map((item) => (
            <View
              onClick={() => onRewardClick(item)}
              className={className(styles.reward, Number(value) === item && styles.actived)}
              key={item}
            >
              ￥{item}
            </View>
          ))}
        </View>

        {/* 使用会报错 */}
        {/* <Viewider className={styles.Viewider}></Viewider> */}

        <View className={styles.button}>
          <Button onClick={onCancel} className={styles.cancel} type="default">
            取消
          </Button>
          <Button onClick={onSubmitClick} className={styles.ok} type="primary">
            确定
          </Button>
        </View>
      </View>
    </Popup>
  );
};

export default InputPop;
