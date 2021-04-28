import React, { useState } from 'react';
import { Toast, Popup, Button, Input } from '@discuzq/design';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel, rewardAmount } = props;


  const [value, setValue] = useState('');
  const [moneyNum, setMoneyNum] = useState('');


  const onInputChange = (val) => {
    if (Number(val) >= 0 && Number(val) <= 100) {
      setValue(val);
      setMoneyNum(Number(val) * 0.01 * rewardAmount);
    } else {
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
      <div className={styles.container}>
        <div className={styles.header}>采纳回复悬赏</div>
        <div className={styles.body}>
          <div className={styles.percentage}>
            <div className={styles.text}>悬赏百分比:</div>
            <Input
              mode='number'
              className={styles.input}
              value={value}
              maxLength={3}
              onChange={e => onInputChange(e.target.value)}
            />
            <div className={styles.text}>%</div>
          </div>
          <div className={styles.rewardMoney}>
            <div className={styles.text}>悬赏金额:</div>
            <Input mode='number' className={styles.input} value={moneyNum} disabled={true} />
          </div>
        </div>
        <div className={styles.button}>
        <Button full={true} onClick={onSubmitClick} className={styles.ok} type="primary" size="large">
          确定
        </Button>
        <Button full={true} onClick={onCancel} className={styles.cancel} type="primary" size="large">
          取消
        </Button>
        </div>
        <div className={styles.blank}></div>
      </div>
    </Popup>
  );
};

export default InputPop;
