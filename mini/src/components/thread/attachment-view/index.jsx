import React, { useState }from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import Toast from '@discuzq/design/dist/components/toast/index';
import Spin from '@discuzq/design/dist/components/spin/index';
import { extensionList, isPromise, noop } from '../utils';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';

import xlsOutlined from '../../../../../web/public/dzq-img/xls-outlined.png';
import docOutlined from '../../../../../web/public/dzq-img/doc-outlined.png';
import pptOutlined from '../../../../../web/public/dzq-img/ppt-outlined.png';
import zipOutlined from '../../../../../web/public/dzq-img/zip-outlined.png';
import pdfOutlined from '../../../../../web/public/dzq-img/pdf-outlined.png';
import textOutlined from '../../../../../web/public/dzq-img/text-outlined.png';
import videoOutlined from '../../../../../web/public/dzq-img/video-outlined.png';
import audioOutlined from '../../../../../web/public/dzq-img/audio-outlined.png';
import imageOutlined from '../../../../../web/public/dzq-img/image-outlined.png';
import formOutlined from '../../../../../web/public/dzq-img/form-outlined.png';
import fileOutlined from '../../../../../web/public/dzq-img/file-outlined.png';

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
    if(!threadId || !attachmentId) return;

    // TODO: toastInstance 返回的是boolean
    // let toastInstance = Toast.loading({
    //   duration: 0,
    // });

    thread.fetchThreadAttachmentUrl(threadId, attachmentId).then((res) => {
      if(res?.code === 0 && res?.data) {
        const { url } = res.data;
        if(!url) {
          Toast.info({ content: '获取下载链接失败' });
        }

        callback(url);
      } else {
        Toast.info({ content: res?.msg });
      }
    }).catch((error) => {
      Toast.info({ content: '获取下载链接失败' });
      console.error(error);
      return;
    }).finally(() => {
      // toastInstance?.destroy();
    });
  }

  const [downloading, setDownloading] =
        useState(Array.from({length: attachments.length}, () => false));

  const onDownLoad = (item, index) => {
    updateViewCount();
    if (!isPay) {

      // 下载中
      if(downloading?.length && downloading[index]) {
        Toast.info({content: "下载中，请稍后"});
        return;
      }

      if(!item || !threadId) return;

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
    updateViewCount();
    if (!isPay) {
      if(!item || !threadId) return;

      const attachmentId = item.id;
      fetchDownloadUrl(threadId, attachmentId, (url) => {
        Taro.setClipboardData({
          data: url,
          success: function (res) {
            Taro.getClipboardData({
              success: function (res) {
              }
            })
          }
        })
      });

    } else {
      onPay();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'XLS':
      case 'XLSX':
        return xlsOutlined;
      case 'DOC':
      case 'DOCX':
        return docOutlined;
      case 'PPT':
      case 'PPTX':
        return pptOutlined;
      case 'RAR':
      case 'ZIP':
        return zipOutlined;
      case 'PDF':
        return pdfOutlined;
      case 'TXT':
        return textOutlined;
      case 'MP4':
        return videoOutlined;
      case 'M4A':
      case 'MP3':
        return audioOutlined;
      case 'PNG':
      case 'JPEG':
        return imageOutlined;
      case 'FORM':
        return formOutlined;
      default:
        break;
    }
    return fileOutlined;
  }

  const Normal = ({ item, index, type }) => {
    const iconLink = getIcon(type);
    return (
      <View className={styles.container} key={index} onClick={onClick} >
        <View className={styles.wrapper}>
          <View className={styles.left}>
            <Image className={styles.containerIcon} mode="widthfix" src={iconLink}/>
            <View className={styles.containerText}>
              <Text className={styles.content}>{item.fileName}</Text>
              <Text className={styles.size}>{handleFileSize(parseFloat(item.fileSize || 0))}</Text>
            </View>
          </View>

          <View className={styles.right}>
            <Text onClick={throttle(() => onLinkShare(item), 1000)}>链接</Text>
            <View className={styles.label}>
              { downloading[index] ?
                <Spin className={styles.spinner} type="spinner" /> :
                <Text onClick={throttle(() => onDownLoad(item, index), 1000)}>下载</Text>
              }
            </View>
          </View>
        </View>
      </View>
    );
  };

  const Pay = ({ item, index, type }) => {
    const iconLink = getIcon(type);
    return (
      <View className={`${styles.container} ${styles.containerPay}`} key={index} onClick={onPay}>
        <Image className={styles.containerIcon} mode="widthfix" src={iconLink}/>
        <Text className={styles.content}>{item.fileName}</Text>
      </View>
    );
  };

  return (
    <View className={styles.wrapper}>
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
