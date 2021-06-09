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
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onDownLoad = (item, index) => {
    // 下载中
    if(downloading?.length && downloading[index]) return;
    if(!item || !threadId) return;

    if (!isPay) {
      downloading[index] = true;
      setDownloading([...downloading]);

      if(!item?.url) {
        setErrorMsg("获取下载链接失败");
        setTimeout(() => {
          setErrorMsg("");
        }, 3000);
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
              setSuccessMsg("下载成功");
              setTimeout(() => {
                setSuccessMsg("");
              }, 3000);
            },
            fail: function (error) {
              setErrorMsg("小程序暂不支持下载此类文件\n请点击“链接”获取下载链接");
              setTimeout(() => {
                setErrorMsg("");
              }, 3000);
              console.error(error.errMsg)
            },
            complete: function () {
            }
          })
        },
        fail: function (error) {
          setErrorMsg(error.errMsg);
          setTimeout(() => {
            setErrorMsg("");
          }, 3000);
          console.error(error.errMsg)
        },
        complete: function () {
          setTimeout(() => {
            setErrorMsg("");
            setSuccessMsg("");
          }, 3000);
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
        } else {
          setErrorMsg(res?.msg);
          console.error(res);
        }
      }).catch((error) => {
        setErrorMsg(error.errMsg);
        console.error(error);
        return;
      }).finally(() => {
        setTimeout(() => {
          setErrorMsg("");
          setSuccessMsg("");
        }, 3000);
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

  useEffect(() => {
    if(errorMsg !== '' || successMsg !== '') {
      setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 3000);
    }
  }, [errorMsg])

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
        { errorMsg !== "" && 
          <View className={[styles.msgWrapper, styles.errorMsgWrapper]}>
            <Icon className={styles.tipsIcon} size={20} name={'WrongOutlined'}></Icon>
            <Text className={styles.errorMessage}>{errorMsg}</Text>
          </View>
        }
        { successMsg !== "" && 
          <View className={[styles.msgWrapper, styles.successMsgWrapper]}>
            <Icon className={styles.tipsIcon} size={20} name={'CheckOutlined'}></Icon>
            <Text className={styles.successMessage}>{successMsg}</Text>
          </View>
        }
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
