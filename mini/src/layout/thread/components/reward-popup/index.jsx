import React, { useState } from 'react';
import { Popup, Button, Input } from '@discuzq/design';
import styles from './index.module.scss';
import { View } from '@tarojs/components';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel } = props;


  const [value, setValue] = useState('');


  const onInputChange = (val) => {
    setValue(val);
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
        <View className={styles.body}>
          <View className={styles.percentage}>
            <View className={styles.text}>打赏金额:</View>
            <Input
              mode='number'
              className={styles.input}
              placeholder='请输入打赏金额'
              value={value}
              onChange={e => onInputChange(e.target.value)}
            />
          </View>
        </View>
        <View className={styles.button}>
          <Button full={true} onClick={onSubmitClick} className={styles.ok} type="primary" size="large">
            确定
        </Button>
          <Button full={true} onClick={onCancel} className={styles.cancel} type="text" size="large">
            取消
        </Button>
        </View>
      </View>
    </Popup>
  );
};

export default InputPop;
