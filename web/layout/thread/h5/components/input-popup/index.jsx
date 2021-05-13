import React, { useEffect, useState } from 'react';
import { Icon, Popup, Textarea, Upload, Button } from '@discuzq/design';
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

  const onCancel = () => {
    onClose();
  };

  return (
    <Popup position="bottom" visible={visible} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.main}>
          <Textarea
            className={styles.input}
            maxLength={5000}
            rows={5}
            showLimit={true}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={inputText}
          ></Textarea>
          {/* <Upload listType='card'>
            <Button loading={loading} type='text' className={styles.upload}>
              <Icon name="PlusOutlined" size={20}></Icon>
              <span>上传附件</span>
            </Button>
          </Upload> */}
        </div>

        <div className={styles.button}>
          <Button onClick={onCancel} className={styles.cancel} type="default">
            取消
          </Button>
          <Button loading={loading} type="primary" onClick={onSubmitClick} className={styles.ok}>
            发布
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default InputPop;
