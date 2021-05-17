import React, { useState } from 'react';
import { Popup, Button, Input, Divider } from '@discuzq/design';
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
      <div className={styles.container}>
        <div className={styles.header}>支付作者继续创作</div>

        <div className={styles.rewardInput}>
          <span className={styles.prepend}>支付金额</span>
          <Input
            mode="number"
            placeholder="金额"
            className={styles.input}
            value={value}
            onChange={(e) => onInputChange(e.target.value)}
          />
          <span className={styles.append}>元</span>
        </div>

        <div className={styles.rewardList}>
          {rewardList.map((item) => (
            <div
              onClick={() => onRewardClick(item)}
              className={className(styles.reward, Number(value) === item && styles.actived)}
              key={item}
            >
              ￥{item}
            </div>
          ))}
        </div>

        <Divider className={styles.divider}></Divider>

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
