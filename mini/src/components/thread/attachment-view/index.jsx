import React, { useState } from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import Toast from '@discuzq/design/dist/components/toast/index';
import Spin from '@discuzq/design/dist/components/spin/index';
import { extensionList, isPromise, noop } from '../utils';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import getAttachmentIconLink from '@common/utils/get-attachment-icon-link';

import { throttle } from '@common/utils/throttle-debounce.js';

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
  user = null,
  threadId = null,
  thread = null,
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

    // TODO: toastInstance 返回的是boolean
    // let toastInstance = Toast.loading({
    //   duration: 0,
    // });

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
          Toast.info({ content: res?.msg });
        }
      })
      .catch((error) => {
        Toast.info({ content: '获取下载链接失败' });
        console.error(error);
        return;
      })
      .finally(() => {
        // toastInstance?.destroy();
      });
  };

  const [downloading, setDownloading] = useState(Array.from({ length: attachments.length }, () => false));

  const onDownload = (item, index) => {
    updateViewCount();
    if (!isPay) {
      // 下载中
      if (downloading?.length && downloading[index]) {
        Toast.info({ content: '下载中，请稍后' });
        return;
      }

      if (!item || !threadId) return;

      downloading[index] = true;
      setDownloading([...downloading]);

      if (!item?.url) {
        Toast.info({ content: '获取下载链接失败' });
        downloading[index] = false;
        setDownloading([...downloading]);
        return;
      }

      Taro.downloadFile({
        url: item.url,
        success: function (res) {
          Taro.openDocument({
            filePath: res.tempFilePath,
            success: function (res) {
              Toast.info({ content: '下载成功' });
            },
            fail: function (error) {
              Toast.info({ content: '小程序暂不支持下载此类文件，请点击“链接”复制下载链接' });
              console.error(error.errMsg);
            },
            complete: function () {},
          });
        },
        fail: function (error) {
          if (error?.errMsg.indexOf('domain list') !== -1) {
            Toast.info({ content: '下载链接不在域名列表中' });
          } else if (error?.errMsg.indexOf('invalid url') !== -1) {
            Toast.info({ content: '下载链接无效' });
          } else {
            Toast.info({ content: error.errMsg });
          }
          console.error(error.errMsg);
        },
        complete: function () {
          downloading[index] = false;
          setDownloading([...downloading]);
        },
      });
    } else {
      onPay();
    }
  };

  const onLinkShare = (item, index) => {
    updateViewCount();
    if (!isPay) {
      if (!item || !threadId) return;

      const attachmentId = item.id;
      fetchDownloadUrl(threadId, attachmentId, (url) => {
        Taro.setClipboardData({
          data: url,
          success: function (res) {
            Taro.getClipboardData({
              success: function (res) {},
            });
          },
        });
      });
    } else {
      onPay();
    }
  };

  const Normal = ({ item, index, type }) => {
    return (
      <View className={styles.container} key={index} onClick={onClick}>
        <View className={styles.wrapper}>
          <View className={styles.left}>
            <Image src={getAttachmentIconLink(type)} className={styles.containerIcon} mode="widthfix" />
            <View className={styles.containerText}>
              <Text className={styles.content}>{item.fileName}</Text>
              <Text className={styles.size}>{handleFileSize(parseFloat(item.fileSize || 0))}</Text>
            </View>
          </View>

          <View className={styles.right}>
            <Text onClick={throttle(() => onLinkShare(item), 1000)}>链接</Text>
            <View className={styles.label}>
              {downloading[index] ? (
                <Spin className={styles.spinner} type="spinner" />
              ) : (
                <Text onClick={throttle(() => onDownload(item, index), 1000)}>下载</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const Pay = ({ item, index, type }) => {
    return (
      <View className={`${styles.container} ${styles.containerPay}`} key={index} onClick={onPay}>
        <Image src={getAttachmentIconLink(type)} className={styles.containerIcon} mode="widthfix" />
        <Text className={styles.content}>{item.fileName}</Text>
      </View>
    );
  };

  return (
    <View className={styles.wrapper}>
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
    </View>
  );
};

export default inject('user', 'thread')(observer(Index));
