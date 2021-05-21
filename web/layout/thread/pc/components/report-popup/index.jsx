import React, { useState } from 'react';
import { Icon, Popup, Button, Textarea, Radio } from '@discuzq/design';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel, inputText, reportContent = [] } = props;

  const [value, setValue] = useState('');
  const [res, setRes] = useState('');
  const [showInput, setShowInput] = useState(false);

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

  const toggleOther = () => {
    setShowInput(!showInput);
  };

  return (
    <Popup position="center" visible={visible} onClose={onCancel}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>举报</div>
          <div className={styles.headerIcon}>
            <Icon size={12} name="CloseOutlined" onClick={onCancel}></Icon>
          </div>
        </div>
        <div className={styles.body}>
          <Radio.Group defaultValue="5" onChange={(e) => onChoiceChange(e)}>
            <div className={styles.radioGroup}>
              {reportContent.map((val, index) => (
                <div className={styles.reportTitle} key={index}>
                  <Radio name={`${index}`}></Radio>
                  <div className={styles.content}>{val}</div>
                </div>
              ))}
            </div>
            <div className={styles.other}>
              <div className={styles.reportTitle}>
                <div className={styles.content}>其他理由</div>
                <Icon
                  className={styles.reportIcon}
                  size={12}
                  name={showInput ? 'UpwardOutlined' : 'UnderOutlined'}
                  onClick={toggleOther}
                ></Icon>
              </div>
            </div>
          </Radio.Group>
          {showInput && (
            <div className={styles.textarea}>
              <Textarea
                className={styles.input}
                rows={5}
                showLimit={true}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={inputText}
              ></Textarea>
            </div>
          )}
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
