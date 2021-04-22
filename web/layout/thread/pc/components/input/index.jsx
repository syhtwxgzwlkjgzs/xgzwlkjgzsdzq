
import React, { useState } from 'react';
import { Textarea, Upload, Button, Icon } from '@discuzq/design';
import styles from './index.module.scss';

const Input = (props) => {
  const { visible, onSubmit, onClose } = props;

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

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
      <div className={styles.container}>
        <div className={styles.main}>
          <Textarea
            className={styles.input}
            rows={5}
            showLimit={true}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder='写下我的评论....'>
          </Textarea>
          {/* <Upload listType='card'>
            <Button loading={loading} type='text' className={styles.upload}>
              <Icon name="PlusOutlined" size={20}></Icon>
              <span>上传附件</span>
            </Button>
          </Upload> */}
        </div>
        <div className={styles.footer}>
            <div className={styles.linkBtn}>
                <Icon
                  name='PoweroffOutlined'
                  size='20'
                  className={styles.btnIcon}>
                </Icon>
                <Icon
                  name='PoweroffOutlined'
                  size='20'
                  className={styles.btnIcon}>
                </Icon>
                <Icon
                  name='PoweroffOutlined'
                  size='20'
                  className={styles.btnIcon}>
                </Icon>
            </div>
            <Button loading={loading} onClick={onSubmitClick} className={styles.button} type='primary' size='large'>发布</Button>
        </div>
      </div>);
};

export default Input;
