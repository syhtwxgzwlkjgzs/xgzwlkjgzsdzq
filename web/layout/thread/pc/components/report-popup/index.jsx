import React, { useState } from 'react';
import { Icon, Popup, Button, Textarea, Radio } from '@discuzq/design';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel, inputText, reportContent = [] } = props;


  const [value, setValue] = useState('');
  const [res, setRes] = useState('');


  const onChoiceChange = (e) => {
    if (e === 'other') {
      setValue('');
      setRes('');
    } else {
      setRes(reportContent[Number(e)]);
    }
  };

  const onSubmitClick = async () => {
    if (typeof onOkClick === 'function') {
      try {
        const success = await onOkClick(res);
        if (success) {
          setValue('');
          setRes('');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChange = (val) => {
    setValue(val);
    setRes(val);
  };

  return (
    <Popup position="center" visible={visible} onClose={onCancel}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>举报</div>
          <div className={styles.headerIcon}>
            {/* 叉号icon不显示，暂用对号代替 */}
            <Icon size={14} name="CheckOutlined" onClick={onCancel}></Icon>
          </div>
        </div>
        <div className={styles.body}>
          <Radio.Group defaultValue='5' onChange={e => onChoiceChange(e)}>
            <div className={styles.radioGroup}>
              {
                reportContent.map((val, index) => (
                  <div className={styles.reportTitle} key={index}>
                    <Radio name={`${index}`}></Radio>
                    <div className={styles.content}>{val}</div>
                  </div>
                ))
              }
            </div>
            <div className={styles.other}>
              <div className={styles.reportTitle}>
                <Radio name="other"></Radio>
                <div className={styles.content}>其他理由</div>
              </div>
            </div>
          </Radio.Group>
          <div className={styles.textarea}>
            <Textarea
              className={styles.input}
              rows={5}
              showLimit={true}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={inputText}>
            </Textarea>
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
      </div>
    </Popup>
  );
};

export default InputPop;
