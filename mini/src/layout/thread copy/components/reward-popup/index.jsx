import React, { useState } from 'react';
import Popup from '@discuzq/design/dist/components/popup/index';
import Button from '@discuzq/design/dist/components/button/index';
import Input from '@discuzq/design/dist/components/input/index';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

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
        <View className={styles.header}>打赏</View>

        <View className={styles.percentage}>
          <Text className={styles.text}>打赏金额</Text>
          <Input
            prefixIcon="RenminbiOutlined"
            mode="number"
            placeholder="请输入打赏金额"
            className={styles.input}
            value={value}
            onChange={(e) => onInputChange(e.target.value)}
          />
        </View>

        <View className={styles.rewardList}>
          {rewardList.map((item) => (
            <Button onClick={() => onRewardClick(item)} className={styles.reward} key={item}>
              ￥{item}
            </Button>
          ))}
        </View>

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
