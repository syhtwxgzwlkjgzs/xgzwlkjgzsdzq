import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import Popup from '@discuzq/design/dist/components/popup/index';
import Textarea from '@discuzq/design/dist/components/textarea/index';

import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onSubmit, initValue, onClose, inputText = '写评论...' } = props;

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(initValue || '');
  }, [initValue]);

  const onSubmitClick = async () => {
    if (loading) return;

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
    <Popup position="bottom" visible={visible} onClose={onClose} customScroll={true}>
      <View className={styles.container}>
        <View className={styles.main}>
          <Textarea
            className={styles.input}
            maxLength={5000}
            rows={4}
            showLimit={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={inputText}
            disabled={loading}
            placeholderClass={styles.placeholder}
            fixed={true}
            adjustPosition={true}
            cursorSpacing={200}
          ></Textarea>
          {/* <Upload listType='card'>
            <Button loading={loading} type='text' className={styles.upload}>
              <Icon name="PlusOutlined" size={20}></Icon>
              <Text>上传附件</Text>
            </Button>
          </Upload> */}
        </View>

        <View className={styles.button}>
          {/* <Button onClick={onCancel} className={styles.cancel} type="default">
            取消
          </Button> */}
          {/* <Button loading={loading} type="primary" onClick={onSubmitClick} className={styles.ok} type='text'>
            发布
          </Button> */}
          <View onClick={onSubmitClick} className={styles.ok}>
            发布
          </View>
        </View>
      </View>
    </Popup>
  );
};

InputPop.options = {
  addGlobalClass: true,
};

export default InputPop;
