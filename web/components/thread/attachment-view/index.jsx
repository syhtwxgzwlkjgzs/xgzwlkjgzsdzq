import React, { useState }from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Toast, Spin } from '@discuzq/design';
import { extensionList, isPromise, noop } from '../utils';
import { throttle } from '@common/utils/throttle-debounce.js';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import isWeiXin from '@common/utils/is-weixin';

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
    if(!threadId || !attachmentId) return;

    let toastInstance = Toast.loading({
      duration: 0,
    });

    thread.fetchThreadAttachmentUrl(threadId, attachmentId).then((res) => {
      if(res?.code === 0 && res?.data) {
        const { url } = res.data;
        if(!url) {
          Toast.info({ content: '获取下载链接失败' });
        }
        callback(url);
      } else {
        if(res?.msg || res?.Message) Toast.info({ content: res?.msg || res?.Message });
      }
    }).catch((error) => {
      Toast.info({ content: '获取下载链接失败' });
      console.error(error);
      return;
    }).finally(() => {
      toastInstance?.destroy();
    });
  }

  const [downloading, setDownloading] =
        useState(Array.from({length: attachments.length}, () => false));

  const onDownLoad = (item, index) => {
    updateViewCount();
    if (!isPay) {
      if(!item || !threadId) return;

      downloading[index] = true;
      setDownloading([...downloading]);


      if(isWeiXin()) {
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
      if(!item || !threadId) return;

      const attachmentId = item.id;
      fetchDownloadUrl(threadId, attachmentId, async (url) => {
        setTimeout(() => {
          h5Share({url: url});
          Toast.success({
            content: '链接复制成功',
          });
        }, 300);
      });

    } else {
      onPay();
    }
  };

  const handleIcon = (type) => {
    if (type === 'XLS' || type === 'XLSX') {
      return 'XLSOutlined';
    } if (type === 'DOC' || type === 'DOCX') {
      return 'DOCOutlined';
    } if (type === 'ZIP') {
      return 'DOCOutlined';
    } if (type === 'PDF') {
      return 'DOCOutlined';
    } if (type === 'PPT') {
      return 'PPTOutlined';
    }
    return 'DOCOutlined';
  };

  const Normal = ({ item, index, type }) => {
    const iconName = handleIcon(type);
    return (
      <div className={styles.container} key={index} onClick={onClick} >
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <Icon className={styles.containerIcon} size={20} name={iconName} />
            <div className={styles.containerText}>
              <span className={styles.content}>{item.fileName}</span>
              <span className={styles.size}>{handleFileSize(parseFloat(item.fileSize || 0))}</span>
            </div>
          </div>

          <div className={styles.right}>
            <span className={styles.span} onClick={throttle(() => onLinkShare(item), 1000)}>链接</span>
            <div className={styles.label}>
              { downloading[index] ?
                  <Spin className={styles.spinner} type="spinner" /> :
                  <span className={styles.span} onClick={throttle(() => onDownLoad(item, index), 1000)}>下载</span>
              }
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Pay = ({ item, index, type }) => {
    const iconName = handleIcon(type);
    return (
      <div className={`${styles.container} ${styles.containerPay}`} key={index} onClick={onPay}>
        <Icon className={styles.containerIcon} size={20} name={iconName} />
        <span className={styles.content}>{item.fileName}</span>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
        {
          attachments.map((item, index) => {
            // 获取文件类型
            const extension = item?.extension || '';
            const type = extensionList.indexOf(extension.toUpperCase()) > 0
              ? extension.toUpperCase()
              : 'UNKNOWN';
            return (
              !isPay ? (
                <Normal key={index} item={item} index={index} type={type} />
              ) : (
                <Pay key={index} item={item} index={index} type={type} />
              )
            );
          })
        }
    </div>
  );
};

export default inject('thread', 'user')(observer(Index));
