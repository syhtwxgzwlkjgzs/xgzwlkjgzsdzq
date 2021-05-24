/**
 * 附件操作栏比如：图片上传、视频上传、语音上传等
 */
import React, { useState, useEffect } from 'react';
import { Icon, Toast } from '@discuzq/design';
import styles from './index.module.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { attachIcon } from '@common/constants/const';
import { createAttachment } from '@common/server';
import { THREAD_TYPE } from '@common/constants/thread-post';
import { tencentVodUpload } from '@common/utils/tencent-vod';

// TODO: upload 待单独独立出来
function fileToObject(file) {
  return {
    ...file,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type,
    uid: file.uid,
    percent: 0,
    originFileObj: file,
  };
}

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function getObjectURL(file) {
  let url = null;
  if (window.createObjcectURL !== undefined) {
    url = window.createOjcectURL(file);
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL !== undefined) {
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

function AttachmentToolbar(props) {
  let file = null;
  let toastInstance = null;
  const [showAll, setShowAll] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const inputRef = React.createRef(null);

  function handleAttachClick(e, item) {
    let action = item.type;
    let actionItem = item;
    if (currentAction === item.type) {
      action = '';
      actionItem = { type: '' };
    }
    setCurrentAction(action);
    props.onAttachClick(actionItem);
    setShowAll(false);
  }

  const handleToggle = (e) => {
    e.stopPropagation();
    setShowAll(!showAll);
  };

  const trggerInput = () => {
    inputRef.current.click();
  };

  const uploadFiles = async (files, item = {}) => {
    const { onUploadComplete } = props;
    if (item.type === THREAD_TYPE.video) {
      file = files[0];
      tencentVodUpload({
        file,
        onUploading: () => {
          toastInstance = Toast.loading({
            content: '上传中...',
            duration: 0,
          });
        },
        onComplete: (res, file) => {
          onUploadComplete(res, file, item.type);
          toastInstance?.destroy();
        },
        onError: (err) => {
          Toast.error({ content: err.message });
        },
      });
    } else {
      // 其他类型上传
      let cloneList = [...files];

      cloneList = cloneList.map((file, index) => {
        file.thumbUrl = getObjectURL(file);
        file.uid = file.uid ?? `${index}__${uuid()}`;
        return fileToObject(file);
      });

      // this.props.onUploadChange(cloneList, item);

      cloneList.forEach(async (file) => {
        const formData = new FormData();
        formData.append('file', file.originFileObj);
        Object.keys((item.data || [])).forEach((elem) => {
          formData.append(elem, item.data[elem]);
        });
        const ret = await createAttachment(formData);
        props.onUploadComplete(ret, file, item);
      });
    }
  };

  const handleChange = (e, item) => {
    if (e.target instanceof HTMLInputElement) {
      const { files } = e.target;
      if (!files) {
        return;
      }
      uploadFiles(files, item);

      inputRef.current.value = null;
    }
  };

  const handleClick = () => {
    setShowAll(false);
  };

  useEffect(() => {
    window.document.body.addEventListener('click', handleClick);

    return () => {
      window.document.body.removeEventListener('click', handleClick);
    };
  }, []);

  const getIconCls = (item) => {
    const cls = styles['dvditor-attachment-toolbar__item'];
    const activeCls = `${styles['dvditor-attachment-toolbar__item']} ${styles.active}`;
    const action = props.currentSelectedToolbar;
    if (item.type === action) return activeCls;
    const { postData } = props;
    if (item.type === THREAD_TYPE.reward && postData?.rewardQa?.value) return activeCls;
    if (item.type === THREAD_TYPE.goods && postData?.product?.id) return activeCls;
    if (item.type === THREAD_TYPE.voice && postData?.audio?.id) return activeCls;
    if (item.type === THREAD_TYPE.video && postData?.video?.id) return activeCls;
    if (item.type === THREAD_TYPE.image && Object.values(postData?.images || []).length > 0) return activeCls;
    return cls;
  };

  const icons = () => attachIcon.map((item) => {
    const { permission } = props;
    if (props.pc && item.type === THREAD_TYPE.voice) return null;
    const clsName = getIconCls(item);
    if (!item.isUpload) {
      return permission[item.type] ? (
        <Icon
          key={item.name}
          onClick={e => handleAttachClick(e, item)}
          className={clsName}
          name={item.name}
          size="20"
        />
      ) : null;
    }
    return permission[item.type] ? (
      <div
        key={item.name}
        onClick={trggerInput}
        className={clsName}
      >
        <Icon
          onClick={e => handleAttachClick(e, item)}
          name={item.name}
          size="20" />
        <input
          style={{ display: 'none' }}
          type="file"
          ref={inputRef}
          onChange={(e) => {
            handleChange(e, item);
          }}
          multiple={item.limit > 1}
          accept={item.accept}
        />
      </div>
    ) : null;
  });

  if (props.pc) return icons();
  const styl = !showAll ? { display: 'none' } : {};
  const action = props.currentSelectedToolbar || currentAction;
  const currentIcon = attachIcon.filter(item => item.type === action)[0]?.name
    || attachIcon.filter(item => item.type === THREAD_TYPE.image)[0]?.name;

  return (
    <div className={styles['dvditor-attachment-toolbar']}>
      {!showAll && (
        <>
          <div className={styles['dvditor-attachment-toolbar__left']}>
            {props.category}
          </div>
          <div className={styles['dvditor-attachment-toolbar__right']} onClick={handleToggle}>
            {currentIcon && <Icon name={currentIcon} size="20" />}
            <Icon name="MoreBOutlined" size="20" />
          </div>
        </>
      )}
      <div className={styles['dvditor-attachment-toolbar__inner']} style={styl}>
        <div className={styles['dvditor-attachment-toolbar__left']}>
          {icons()}
        </div>
        <div
          className={classNames(styles['dvditor-attachment-toolbar__right'], styles.show)}
          onClick={handleToggle}
        >
          <Icon name="MoreBOutlined" size="20" />
        </div>
      </div>
    </div>
  );
}

AttachmentToolbar.propTypes = {
  onAttachClick: PropTypes.func,
  category: PropTypes.element,
};

export default AttachmentToolbar;
