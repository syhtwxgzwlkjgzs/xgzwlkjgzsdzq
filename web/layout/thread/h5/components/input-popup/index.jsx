import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Icon, Popup, Textarea, Divider } from '@discuzq/design';
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
        const success = await onSubmit(value, imageList);
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

    // 请求表情地址
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
    const atListStr = atList.map((atUser) => ` @${atUser} `).join('');
    setValue(value + atListStr || '');
    setShowEmojis(false);
  };

  const handleUploadChange = async (list) => {
    setImageList(list);
  };

  const beforeUpload = (value) => {
    return true;
  };

  const onComplete = (value, file) => {
    if (value.code === 0) {
      file.response = value.data;
    }
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

        {showPicture && (
          <Fragment>
            <div className={styles.imageUpload}>
              <ImageUpload
                fileList={imageList}
                onChange={handleUploadChange}
                onComplete={onComplete}
                beforeUpload={beforeUpload}
              />
            </div>
            <Divider className={styles.divider}></Divider>
          </Fragment>
        )}

        {showAt && <AtSelect visible={showAt} getAtList={onAtListChange} onCancel={onAtIconClick} />}

        {showEmojis && (
          <div className={styles.emojis}>
            <Emoji show={showEmojis} emojis={emojis} onClick={onEmojiClick} />
          </div>
        )}

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
