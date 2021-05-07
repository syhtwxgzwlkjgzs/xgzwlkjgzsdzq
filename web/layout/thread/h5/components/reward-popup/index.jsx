import React, { useState } from 'react';
import { Popup, Button, Input } from '@discuzq/design';
import styles from './index.module.scss';

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
      <div className={styles.container}>
        <div className={styles.body}>
          <div className={styles.percentage}>
            <div className={styles.text}>打赏金额:</div>
            <Input
              mode='number'
              className={styles.input}
              placeholder='请输入打赏金额'
              value={value}
              onChange={e => onInputChange(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.button}>
        <Button full={true} onClick={onSubmitClick} className={styles.ok} type="primary" size="large">
          确定
        </Button>
        <Button full={true} onClick={onCancel} className={styles.cancel} type="text" size="large">
          取消
        </Button>
        </div>
      </div>
    </Popup>
  );
};

export default InputPop;
