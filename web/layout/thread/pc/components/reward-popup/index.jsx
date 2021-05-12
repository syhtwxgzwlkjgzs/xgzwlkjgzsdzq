import React, { useState } from 'react';
import { Popup, Button, Input, Icon } from '@discuzq/design';
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
    <Popup position="center" visible={visible} onClose={onCancel}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>打赏</div>
          <div className={styles.headerIcon}>
            <Icon size={12} name="CloseOutlined" onClick={onCancel}></Icon>
          </div>
        </div>
        <div className={styles.percentage}>
          <Input
            mode='number'
            placeholder='请输入打赏金额'
            className={styles.input}
            value={value}
            onChange={e => onInputChange(e.target.value)}
          />
        </div>

        <div className={styles.button}>
          <Button onClick={onCancel} className={styles.cancel} type="default">
            取消
          </Button>
          <Button onClick={onSubmitClick} className={styles.ok} type="primary">
            确定
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default InputPop;
