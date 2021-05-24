import React, { useEffect, useRef, useState } from 'react';
import { Icon, Popup, Textarea, Upload } from '@discuzq/design';
import styles from './index.module.scss';
import classnames from 'classnames';
import ImageUpload from '@components/thread-post/image-upload';
import { readEmoji } from '@common/server';

import Emoji from '@components/editor/emoji';
import AtSelect from '@components/thread-detail-pc/at-select';

const InputPop = (props) => {
  const { visible, onSubmit, initValue, onClose, inputText = '写评论...' } = props;

  const textareaRef = useRef(null);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [emojis, setEmojis] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAt, setShowAt] = useState(false);
  const [showPicture, setShowPicture] = useState(false);

  const [imageList, setImageList] = useState([]);

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

  const onEmojiIconClick = async () => {
    setShowEmojis(!showEmojis);
    setShowAt(false);
    setShowPicture(false);

    if (!emojis?.length) {
      const ret = await readEmoji();
      const { code, data = [] } = ret;
      if (code === 0) {
        setEmojis(data.map((item) => ({ code: item.code, url: item.url })));
      }
    }
  };

  const onAtIconClick = () => {
    setShowAt(!showAt);
    setShowEmojis(false);
    setShowPicture(false);
  };

  const onPcitureIconClick = () => {
    setShowPicture(!showPicture);
    setShowEmojis(false);
    setShowAt(false);
  };

  const onEmojiClick = (emoji) => {
    setValue(value + emoji.code || '');
    setShowEmojis(false);
  };

  const onAtListChange = (atList) => {
    const atListStr = atList.map((atUser) => `@${atUser}`);
    setValue(value + atListStr || '');
    setShowEmojis(false);
  };

  const handleUploadChange = async (list) => {
    console.log(list);
  };

  const beforeUpload = (value) => {
    console.log('beforeUpload', value);
  };

  const onComplete = (value) => {
    console.log('onComplete', value);
  };

  return (
    <Popup position="bottom" visible={visible} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.main}>
          <Textarea
            className={styles.input}
            maxLength={5000}
            ref={textareaRef}
            rows={4}
            showLimit={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={inputText}
            disabled={loading}
          ></Textarea>
        </div>
        {/* <Upload listType="card" customRequest={handleUploadChange} multiple={true}>
          <Button type="text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Icon name="PlusOutlined" size={20}></Icon>
            <span>上传附件</span>
          </Button>
        </Upload> */}

        {showPicture && (
          <ImageUpload
            fileList={imageList}
            onChange={handleUploadChange}
            onComplete={onComplete}
            beforeUpload={beforeUpload}
          />
        )}

        {showAt && <AtSelect visible={showAt} getAtList={onAtListChange} onCancel={onAtIconClick} />}

        {showEmojis && <Emoji show={showEmojis} emojis={emojis} onClick={onEmojiClick} />}

        <div className={styles.button}>
          <div className={styles.operates}>
            <Icon
              className={classnames(styles.operate, showEmojis && styles.actived)}
              name="SmilingFaceOutlined"
              size={20}
              onClick={onEmojiIconClick}
            ></Icon>
            <Icon
              className={classnames(styles.operate, showAt && styles.actived)}
              name="AtOutlined"
              size={20}
              onClick={onAtIconClick}
            ></Icon>
            <Icon
              className={classnames(styles.operate, showPicture && styles.actived)}
              name="PictureOutlinedBig"
              size={20}
              onClick={onPcitureIconClick}
            ></Icon>
          </div>

          <div onClick={onSubmitClick} className={styles.ok}>
            发布
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default InputPop;
