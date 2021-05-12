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

  const rewardList = [1, 2, 5, 10, 20, 50, 88, 128];

  const onRewardClick = (item) => {
    setValue(item);
  };

  return (
    <Popup position="center" visible={visible} onClose={onCancel}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>打赏</div>
          <Icon className={styles.headerIcon} size={14} name="CloseOutlined" onClick={onCancel}></Icon>
        </div>

        <div className={styles.percentage}>
          <span className={styles.text}>打赏金额</span>
          <Input
            prefixIcon="RenminbiOutlined"
            mode="number"
            placeholder="请输入打赏金额"
            className={styles.input}
            value={value}
            onChange={(e) => onInputChange(e.target.value)}
          />
        </div>

        <div className={styles.rewardList}>
          {rewardList.map((item) => (
            <Button onClick={() => onRewardClick(item)} className={styles.reward} key={item}>
              ￥{item}
            </Button>
          ))}
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
