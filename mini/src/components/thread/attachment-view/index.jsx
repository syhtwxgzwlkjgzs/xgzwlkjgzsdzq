import React, { useState, useEffect }from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import Icon from '@discuzq/design/dist/components/icon/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Spin from '@discuzq/design/dist/components/spin/index';
import { extensionList, isPromise, noop } from '../utils';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Downloader from './downloader';


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

  const downloader = new Downloader();
  const [downloading, setDownloading] =
        useState(Array.from({length: attachments.length}, () => false));

  const onDownLoad = (item, index) => {
    // 下载中
    if(downloading?.length && downloading[index]) {
      Toast.info({content: "下载中，请稍后"});
      return;
    }
    if(!item || !threadId) return;

    if (!isPay) {
      downloading[index] = true;
      setDownloading([...downloading]);

      if(!item?.url) {
        Toast.info({content: "获取下载链接失败"});
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
              Toast.info({content: "下载成功"});
            },
            fail: function (error) {
              Toast.info({ content: "小程序暂不支持下载此类文件，请点击“链接”复制下载链接" });
              console.error(error.errMsg)
            },
            complete: function () {
            }
          })
        },
        fail: function (error) {
          if(error?.errMsg.indexOf("domain list") !== -1) {
            Toast.info({ content: "下载链接不在域名列表中" });
          } else if(error?.errMsg.indexOf("invalid url") !== -1) {
            Toast.info({ content: "下载链接无效" });
          } else {
            Toast.info({ content: error.errMsg });
          }
          console.error(error.errMsg)
        },
        complete: function () {
          downloading[index] = false;
          setDownloading([...downloading]);
        }
      })
    } else {
      onPay();
    }
  };

  const onLinkShare = (item, index) => {
    if (!isPay) {
      const attachmentId = item.id;
      thread.fetchThreadAttachmentUrl(threadId, attachmentId).then((res) => {
        if(res?.code === 0 && res?.data) {
          const { url } = res.data;
          Taro.setClipboardData({
            data: url,
            success: function (res) {
              Taro.getClipboardData({
                success: function (res) {
                }
              })
            }
          })
        } else if(res) {
          Toast.info({ content: res.msg });
          console.error(res);
        }
      }).catch((error) => {
        Toast.info({ content: error.errMsg });
        console.error(error);
        return;
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
            <Text onClick={() => onLinkShare(item, index)}>链接</Text>
            <View className={styles.label}>
              { downloading[index] ?
                <Spin className={styles.spinner} type="spinner" /> :
                <Text onClick={() => onDownLoad(item, index)}>下载</Text>
              }
            </View>
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
    </View>
  );
};

export default inject('user', 'thread')(observer(Index));
