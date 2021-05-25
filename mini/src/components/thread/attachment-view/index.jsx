import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { extensionList, isPromise, noop } from '../utils';
import { View, Text } from '@tarojs/components'
import Downloader from './downloader';


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

  const downloader = new Downloader();

  const getFileType = (filepath) => {
    const idx = filepath.lastIndexOf('.');
    return filepath.substr(idx + 1);
  }

  const onDownLoad = (url) => {
    if (!isPay) {
      downloader?.download(url, true).then((path) => {
        wx.openDocument({
          filePath: path,
          fileType: getFileType(url), // 微信支持下载文件类型：doc, docx, xls, xlsx, ppt, pptx, pdf
          success(res) {
          },
          fail(error) {
            console.error("文件类型不支持：", error.errMsg);
          },
        });
      }).catch((error) => {
        console.error(error.errMsg)
      })
    } else {
      onPay();
    }
  };

  const onPreviewer = (url) => {
    if (!isPay) {
      window.open(url, '_self');
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
      <View className={styles.container} key={index} onClick={onClick} >
        <View className={styles.wrapper}>
          <View className={styles.left}>
            <Icon className={styles.containerIcon} size={20} name={iconName} />
            <View className={styles.containerText}>
              <Text className={styles.content}>{item.fileName}</Text>
              <Text className={styles.size}>{handleFileSize(parseFloat(item.fileSize || 0))}</Text>
            </View>
          </View>

          <View className={styles.right}>
            {/* <Text className={styles.Text} onClick={() => onPreviewer(item.url)}>浏览</Text> */}
            <Text className={styles.Text} onClick={() => onDownLoad(item.url)}>下载</Text>
          </View>
        </View>
      </View>
    );
  };

  const Pay = ({ item, index, type }) => {
    const iconName = handleIcon(type);
    return (
      <View className={`${styles.container} ${styles.containerPay}`} key={index} onClick={onPay}>
        <Icon className={styles.containerIcon} size={20} name={iconName} />
        <Text className={styles.content}>{item.fileName}</Text>
      </View>
    );
  };

  return (
    <View>
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
    </View>
  );
};

export default React.memo(Index);
