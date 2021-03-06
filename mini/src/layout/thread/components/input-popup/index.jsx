import React, { useEffect, useState, createRef, Fragment } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Popup from '@discuzq/design/dist/components/popup/index';
import Textarea from '@discuzq/design/dist/components/textarea/index';
import Divider from '@discuzq/design/dist/components/divider/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import classnames from 'classnames';
import { readEmoji } from '@common/server';
import { THREAD_TYPE } from '@common/constants/thread-post';
import { debounce } from '@common/utils/throttle-debounce';
import Emoji from '@components/emoji';
import styles from './index.module.scss';
import ImageUpload from '../image-upload';

const InputPop = (props) => {
  const { visible, onSubmit, onClose, initValue, inputText = '写评论...', site, thread, checkUser = [] } = props;

  const textareaRef = createRef();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [emojis, setEmojis] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAt, setShowAt] = useState(false);
  const [showPicture, setShowPicture] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [bottomHeight, setBottomHeight] = useState(0);

  const [focus, setFocus] = useState(true);

  // 输入框光标位置
  const [cursorPos, setCursorPos] = useState(0);
  const onChange = (e) => {
    setCursorPos(e.target.cursor || 0);
  };

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  // 监听键盘的高度
  Taro.onKeyboardHeightChange((res) => {
    setBottomHeight((res?.height || 0) - (getBottomSafeArea() || 0));
  });

  // 获取底部安全距离
  const getBottomSafeArea = () => {
    const screenHeight = Taro.getSystemInfoSync().screenHeight;
    const bottom = Taro.getSystemInfoSync().safeArea.bottom;

    return screenHeight - bottom
  };

  // 点击发布
  const onSubmitClick = async () => {
    if (loading || imageUploading) return;

    if (typeof onSubmit === 'function') {
      try {
        setLoading(true);
        const success = await onSubmit(value, imageList);
        if (success) {
          setTimeout(() => {
            setValue('');
          });
          setShowPicture(false);
          setShowEmojis(false);
          setImageList([]);
          thread.setCheckUser([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onCancel = () => {
    setShowAt(false);
    setShowEmojis(false);
    setShowPicture(false);
    onClose();
  };

  const onEmojiIconClick = async () => {
    setShowEmojis(!showEmojis);
    setShowAt(false);
    setShowPicture(false);

    textareaRef.current.blur();
    setFocus(false);

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
    // setShowAt(!showAt);
    Taro.navigateTo({
      url: '/indexPages/thread/selectAt/index?type=thread',
    });
    setShowEmojis(false);
    setShowPicture(false);
  };

  const onPcitureIconClick = () => {
    setShowPicture(!showPicture);
    setShowEmojis(false);
    setShowAt(false);
  };

  // 完成表情选择
  const onEmojiClick = (emoji) => {
    // 在光标位置插入
    const insertPosition = cursorPos || 0;
    const newValue = value.substr(0, insertPosition) + (emoji.code || '') + value.substr(insertPosition);
    setValue(newValue);
    setCursorPos(cursorPos + emoji.code.length);

    textareaRef.current.focus();
    // setFocus(true)

    setShowEmojis(false);
  };

  useEffect(() => {
    // 在光标位置插入
    const atListStr = checkUser.map((atUser) => ` @${atUser} `).join('');
    const insertPosition = cursorPos || 0;
    const newValue = value.substr(0, insertPosition) + (atListStr || '') + value.substr(insertPosition);
    setValue(newValue);
    if (textareaRef?.current) {
      textareaRef.current.focus();
      setFocus(true);
    }
  }, [checkUser]);

  const handleUploadChange = async (list) => {
    setImageList([...list]);
  };

  // 附件、图片上传之前
  const beforeUpload = (cloneList, showFileList, type) => {
    const { webConfig } = site;
    if (!webConfig) return false;
    // 站点支持的文件类型、文件大小
    const { supportFileExt, supportImgExt, supportMaxSize } = webConfig.setAttach;
    if (type === THREAD_TYPE.file) {
      // 当前选择附件的类型大小
      const arr = cloneList[0].name.split('.').pop();
      const fileType = arr.toLocaleLowerCase();
      const fileSize = cloneList[0].size;
      // 判断合法性
      const isLegalType = supportFileExt.toLocaleLowerCase().includes(fileType);
      const isLegalSize = fileSize > 0 && fileSize < supportMaxSize * 1024 * 1024;
      if (!isLegalType) {
        Toast.info({ content: '当前文件类型暂不支持' });
        return false;
      }
      if (!isLegalSize) {
        Toast.info({ content: `上传附件大小范围0 ~ ${supportMaxSize}MB` });
        return false;
      }
    } else if (type === THREAD_TYPE.image) {
      // 剔除超出数量9的多余图片
      const remainLength = 9 - showFileList.length; // 剩余可传数量
      cloneList.splice(remainLength, cloneList.length - remainLength);

      let isAllLegal = true; // 状态：此次上传图片是否全部合法
      cloneList.forEach((item, index) => {
        const arr = item.path.split('.').pop();
        const imageType = arr.toLocaleLowerCase();
        const isLegalType = supportImgExt.toLocaleLowerCase().includes(imageType);

        // 存在不合法图片时，从上传图片列表删除
        if (!isLegalType) {
          cloneList.splice(index, 1);
          isAllLegal = false;
        }
      });

      !isAllLegal && Toast.info({ content: `仅支持${supportImgExt}类型的图片` });

      cloneList?.length && setImageUploading(true);

      return true;
    }

    return true;
  };

  const onComplete = (value, file, list) => {
    if (value.code === 0) {
      file.response = value.data;
    }
    setImageUploading(list?.length && list.some((image) => image.status === 'uploading'));
  };

  const onFail = (ret) => {
    const msg = ret?.Message;
    const code = ret?.Code === -7075; // 错误码为-7075时为不允许上传敏感图
    Toast.error({
      content: code ? msg : '图片上传失败',
    });
  };

  const onClick = () => {
    typeof onCancel === 'function' && onCancel();
  };

  return visible ? (
    <View className={classnames(styles.body, visible && styles.show)}>
      <View className={styles.popup} onClick={onClick}>
        <View onClick={(e) => e.stopPropagation()}>
          <View className={styles.container}>
            <View className={styles.main}>
              {/* <ScrollView scrollY className={styles.valueScroll}> */}
              <Textarea
                className={styles.input}
                maxLength={5000}
                rows={4}
                showLimit={false}
                value={value}
                onBlur={(e) => {
                  onChange(e);
                }}
                onChange={debounce((e) => {
                  onChange(e);
                  setValue(e.target.value);
                }, 100)}
                // onFocus={() => setShowEmojis(false)}
                placeholder={inputText}
                disabled={loading}
                placeholderClass={styles.placeholder}
                forwardedRef={textareaRef}
                focus={focus}
                fixed={true}
                adjustPosition={false}
                // autoHeight={false}
              ></Textarea>
              {/* </ScrollView> */}

              {showPicture && (
                <Fragment>
                  <View className={styles.imageUpload}>
                    <ImageUpload
                      fileList={imageList}
                      onChange={handleUploadChange}
                      onComplete={onComplete}
                      beforeUpload={(cloneList, showFileList) =>
                        beforeUpload(cloneList, showFileList, THREAD_TYPE.image)
                      }
                      onFail={onFail}
                    />
                  </View>
                  <Divider className={styles.divider}></Divider>
                </Fragment>
              )}
            </View>

            <View className={styles.button}>
              <View className={styles.operates}>
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
              </View>
              <View
                onClick={onSubmitClick}
                className={classnames(styles.ok, (loading || imageUploading) && styles.disabled)}
              >
                发布
              </View>
            </View>
          </View>

          {showEmojis && (
            <View className={styles.emojis}>
              <Emoji show={showEmojis} emojis={emojis} onClick={onEmojiClick} />
            </View>
          )}
          <View className={styles.keyboard} style={{ height: `${bottomHeight}px` }}></View>
          <View className={styles.safeArea}></View>
        </View>
      </View>
    </View>
  ) : (
    <View className={classnames(styles.body, visible && styles.show)}></View>
  );
};

InputPop.options = {
  addGlobalClass: true,
};

export default InputPop;