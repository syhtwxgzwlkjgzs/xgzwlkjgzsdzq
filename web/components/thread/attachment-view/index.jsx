import React from 'react';
import { inject, observer } from 'mobx-react';
import goToLoginPage from '@common/utils/go-to-login-page';
import { Icon, Toast } from '@discuzq/design';
import { extensionList, isPromise, noop } from '../utils';
import { copyToClipboard } from '@common/utils/copyToClipboard';

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

  const onDownLoad = (item) => {
    if(!item || !threadId) return;

    // 对没有登录的先登录
    if (!user?.isLogin()) {
      Toast.info({ content: '请先登录!' });
      goToLoginPage({ url: '/user/login' });
      return;
    }

    if (!isPay) {
      let toastInstance = Toast.loading({
        duration: 0,
      });

      const attachmentId = item.id;
      thread.fetchThreadAttachmentUrl(threadId, attachmentId).then((res) => {

        if(res?.code === 0 && res?.data) {
          const { url } = res.data;
          if(url) window.open(url);
          Toast.info({ content: '下载成功' });
        } else {
          Toast.info({ content: res?.msg });
        }
      }).catch((error) => {
        Toast.info({ content: '获取下载链接失败' });
        console.error(error);
        return;
      }).finally(() => {
        toastInstance?.destroy();
      });
    } else {
      onPay();
    }
  };

  const onLinkShare = (item) => {
    if (!isPay) {
      if(!item?.url) return;
      copyToClipboard(item.url);
      Toast.success({
        content: '链接复制成功',
        duration: 1000,
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
            <span className={styles.span} onClick={() => onLinkShare(item)}>链接</span>
            <div className={styles.label}>
              <span className={styles.span} onClick={() => onDownLoad(item)}>下载</span>
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
    <div>
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
