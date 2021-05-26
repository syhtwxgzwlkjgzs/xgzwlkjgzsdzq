
import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';

import Popup from '@discuzq/design/dist/components/popup/index';
import Textarea from '@discuzq/design/dist/components/textarea/index';
import Button from '@discuzq/design/dist/components/button/index';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onSubmit, initValue, onClose, inputText = '请输入内容' } = props;

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(initValue || '');
  }, [initValue]);

  const onSubmitClick = async () => {
    if (typeof onSubmit === 'function') {
      try {
        setLoading(true);
        const success = await onSubmit(value);
        if (success) {
          setValue('');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Popup
      position="bottom"
      visible={visible}
      onClose={onClose}
    >
      <View className={styles.container}>
        <View className={styles.main}>
          <Textarea
            className={styles.input}
            maxLength={5000}
            rows={5}
            showLimit
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={inputText}>
          </Textarea>
        </View>
        <Button full loading={loading} onClick={onSubmitClick} className={styles.button} type='primary' size='large'>发布</Button>
      </View>
    </Popup>
    );
};

export default InputPop;
