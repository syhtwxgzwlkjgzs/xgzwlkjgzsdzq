import React, { useState, useRef }from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Toast, Spin, AudioPlayer } from '@discuzq/design';
import { extensionList, isPromise, noop } from '../utils';
import { throttle } from '@common/utils/throttle-debounce.js';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import isWeiXin from '@common/utils/is-weixin';
import { FILE_PREVIEW_FORMAT, AUDIO_FORMAT } from '@common/constants/thread-post';
import FilePreview from './../file-preview';
import getAttachmentIconLink from '@common/utils/get-attachment-icon-link';

import styles from './index.module.scss';

/**
 * 附件
 * @prop {Array} attachments 附件数组
 * @prop {Boolean} isHidden 是否隐藏删除按钮
 */

const Index = ({
  attachments = [],
  isHidden = true,
  isPay = false,
  onClick = noop,
  onPay = noop,
  threadId = null,
  thread = null,
  user = null,
  updateViewCount = noop,
}) => {
  // 处理文件大小的显示
  const handleFileSize = (fileSize) => {
    if (fileSize > 1000000) {
      return `${(fileSize / 1000000).toFixed(2)} M`;
    }
    if (fileSize > 1000) {
      return `${(fileSize / 1000).toFixed(2)} KB`;
    }

    return `${fileSize} B`;
  };

  const fetchDownloadUrl = (threadId, attachmentId, callback) => {
    if (!threadId || !attachmentId) return;

    let toastInstance = Toast.loading({
      duration: 0,
    });

    thread
      .fetchThreadAttachmentUrl(threadId, attachmentId)
      .then((res) => {
        if (res?.code === 0 && res?.data) {
          const { url } = res.data;
          if (!url) {
            Toast.info({ content: '获取下载链接失败' });
          }
          callback(url);
        } else {
          if (res?.msg || res?.Message) Toast.info({ content: res?.msg || res?.Message });
        }
      })
      .catch((error) => {
        Toast.info({ content: '获取下载链接失败' });
        console.error(error);
        return;
      })
      .finally(() => {
        toastInstance?.destroy();
      });
  };

  const [downloading, setDownloading] = useState(Array.from({ length: attachments.length }, () => false));

  const onDownload = (item, index) => {
    updateViewCount();
    if (!isPay) {
      if (!item || !threadId) return;

      downloading[index] = true;
      setDownloading([...downloading]);

      if (isWeiXin()) {
        window.location.href = item.url;
        Toast.info({ content: '下载成功' });
      } else {
        const attachmentId = item.id;
        fetchDownloadUrl(threadId, attachmentId, (url) => {
          window.location.href = url;
          Toast.info({ content: '下载成功' });
        });
      }

      downloading[index] = false;
      setDownloading([...downloading]);
    } else {
      onPay();
    }
  };

  const onLinkShare = (item, e) => {
    updateViewCount();
    if (!isPay) {
      if (!item || !threadId) return;

      const attachmentId = item.id;
      fetchDownloadUrl(threadId, attachmentId, async (url) => {
        setTimeout(() => {
          if (!h5Share({ url: url })) {
            navigator.clipboard.writeText(url); // qq浏览器不支持异步document.execCommand('Copy')
          }
          Toast.success({
            content: '链接复制成功',
          });
        }, 300);
      });
    } else {
      onPay();
    }
  };

  // 文件是否可预览
  const isAttachPreviewable = (file) => {
    return FILE_PREVIEW_FORMAT.includes(file?.extension?.toUpperCase());
  };

  // 附件预览
  const [previewFile, setPreviewFile] = useState(null);
  const onAttachPreview = (file) => {
    updateViewCount();
    if (!isPay) {
      if(!file || !threadId) return;

      fetchDownloadUrl(threadId, file.id, () => { // 校验权限
        setPreviewFile(file);
      });
    } else {
      onPay();
    }
  };

  // 音频播放
  const isAttachPlayable = (file) => {
    return AUDIO_FORMAT.includes(file?.extension?.toUpperCase())
  };

  const onAttachPlay = async (file, audioRef) => {
    // 该文件已经通过校验，能直接播放
    if (file.readyToPlay) {
      return;  
    }

    const audioPlayer = audioRef?.current?.getState()?.audioCtx;
    audioPlayer?.pause();

    // 播放前校验权限
    updateViewCount();
    if (!isPay) {
      if(!file || !threadId) return;

      await fetchDownloadUrl(threadId, file.id, () => {
        audioPlayer?.play();
        file.readyToPlay = true;
      });
    } else {
      onPay();
    }
  };

  const Normal = ({ item, index, type }) => {
    if (isAttachPlayable(item)) {
      const { url, fileName, fileSize } = item;
      const audioRef = useRef();

      return (
        <div className={styles.audioContainer} key={index} onClick={onClick} >
          <AudioPlayer
            ref={audioRef}
            src={url}
            fileName={fileName}
            fileSize={handleFileSize(parseFloat(item.fileSize || 0))}
            onPlay={throttle(() => onAttachPlay(item, audioRef), 1000)}
            onDownload={throttle(() => onDownLoad(item, index), 1000)}
            onLink={throttle(() => onLinkShare(item), 1000)}
          />
        </div>
      );
    }

    return (
      <div className={styles.container} key={index} onClick={onClick}>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <img className={styles.containerIcon} src={getAttachmentIconLink(type)} />
            <div className={styles.containerText}>
              <span className={styles.content}>{item.fileName}</span>
              <span className={styles.size}>{handleFileSize(parseFloat(item.fileSize || 0))}</span>
            </div>
          </div>

          <div className={styles.right}>
            {isAttachPreviewable(item) ? (
              <span onClick={throttle(() => onAttachPreview(item), 1000)}>预览</span>
            ) : (
              <></>
            )}
            <span className={styles.span} onClick={throttle(() => onLinkShare(item), 1000)}>
              链接
            </span>
            <div className={styles.label}>
              {downloading[index] ? (
                <Spin className={styles.spinner} type="spinner" />
              ) : (
                <span className={styles.span} onClick={throttle(() => onDownload(item, index), 1000)}>
                  下载
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Pay = ({ item, index, type }) => {
    return (
      <div className={`${styles.container} ${styles.containerPay}`} key={index} onClick={onPay}>
        <img className={styles.containerIcon} src={getAttachmentIconLink(type)} />
        <span className={styles.content}>{item.fileName}</span>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      {attachments.map((item, index) => {
        // 获取文件类型
        const extension = item?.extension || '';
        const type = extensionList.indexOf(extension.toUpperCase()) > 0 ? extension.toUpperCase() : 'UNKNOWN';
        return !isPay ? (
          <Normal key={index} item={item} index={index} type={type} />
        ) : (
          <Pay key={index} item={item} index={index} type={type} />
        );
      })}
      {previewFile ? <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} /> : <></>}
    </div>
  );
};

export default inject('thread', 'user')(observer(Index));
