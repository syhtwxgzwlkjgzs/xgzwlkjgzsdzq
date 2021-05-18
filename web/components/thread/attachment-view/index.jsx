import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { extensionList, isPromise, noop } from '../utils';

/**
 * 附件
 * @prop {Array} attachments 附件数组
 * @prop {Boolean} isHidden 是否隐藏删除按钮
 */

const Index = ({ attachments = [], isHidden = true, isPay = false, onClick = noop, onPay = noop }) => {
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

  const onDownLoad = (url) => {
    if (!isPay) {
      window.open(url, '_self')
    } else {
      onPay()
    }
  }

  const onPreviewer = (url) => {
    if (!isPay) {
       window.open(url, '_self')
    } else {
      onPay()
    }
  }

  const handleIcon = (type) => {
    if (type === 'XLS' || type === 'XLSX') {
      return 'XLSOutlined'
    } else if (type === 'DOC' || type === 'DOCX') {
      return 'CloseOutlined'
    } else if (type === 'ZIP') {
      return 'DOCOutlined'
    } else if (type === 'PDF') {
      return 'DOCOutlined'
    } else if (type === 'PPT') {
      return 'PPTOutlined'
    } else {
      return 'DOCOutlined'
    }
  }

  const Normal = ({ item, index, type }) => {
    const iconName = handleIcon(type)
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
            <span className={styles.span} onClick={() => onPreviewer(item.url)}>浏览</span>
            <span className={styles.span} onClick={() => onDownLoad(item.url)}>下载</span>
          </div>
        </div>
      </div>
    )
  }

  const Pay = ({ item, index, type }) => {
    const iconName = handleIcon(type)
    return (
      <div className={`${styles.container} ${styles.containerPay}`} key={index} onClick={onPay}>
        <Icon className={styles.containerIcon} size={20} name={iconName} />
        <span className={styles.content}>{item.fileName}</span>
      </div>
    )
  }

  return (
    <div>
        {
          attachments.map((item, index) => {
            // 获取文件类型
            const extension = item.fileName.split('.')[item.fileName.split('.').length - 1];
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

export default React.memo(Index);
