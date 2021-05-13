import React, { useState } from 'react';
import { Icon, Popup, Button, Input, Slider } from '@discuzq/design';
import throttle from '@common/utils/thottle';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel, rewardAmount } = props;

  const [value, setValue] = useState('');
  const [moneyNum, setMoneyNum] = useState('');

  // const onInputChange = (val) => {
  //   if (Number(val) >= 0 && Number(val) <= 100) {
  //     setValue(val);
  //     setMoneyNum(Number(val) * 0.01 * rewardAmount);
  //   } else {
  //     Toast.success({
  //       content: '请输入0-100',
  //     });
  //   }
  // };
  const onInputChange = (val) => {
    setValue(val);
    setMoneyNum((Number(val) * 0.01 * rewardAmount).toFixed(2));
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
    <Popup position="center" visible={visible} onClose={onCancel}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>采纳回复悬赏</div>
            <div className={styles.headerIcon}>
              <Icon size={14} name="CloseOutlined" onClick={onCancel}></Icon>
            </div>
          </div>

          <div className={styles.body}>
            <div className={styles.percentage}>
              <div className={styles.text}>悬赏百分比</div>
              <div className={styles.slider}>
                <Slider
                  defaultValue={0}
                  max={100}
                  min={0}
                  step={1}
                  onChange={throttle((val) => onInputChange(val), 500)}
                />
                <div className={styles.perCent}>%</div>
              </div>
            </div>
            <div className={styles.rewardMoney}>
              <div className={styles.text}>悬赏金额</div>
              <div className={styles.text}>{moneyNum}元</div>
            </div>
          </div>
        </div>

        <div className={styles.button}>
          <Button onClick={onCancel} className={styles.cancel}>
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
