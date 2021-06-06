import React, { useState, useEffect }from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import Icon from '@discuzq/design/dist/components/icon/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Spin from '@discuzq/design/dist/components/spin/index';
import { extensionList, isPromise, noop } from '../utils';
import goToLoginPage from '@common/utils/go-to-login-page';
import { View, Text } from '@tarojs/components'
import Downloader from './downloader';


/**
 * 附件
 * @prop {Array} attachments 附件数组
 * @prop {Boolean} isHidden 是否隐藏删除按钮
 */

const Index = ({ attachments = [], isHidden = true, isPay = false, onClick = noop, onPay = noop, user }) => {
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

  const onDownLoad = (item, index) => {
    // 下载中
    if(downloading?.length && downloading[index]) return;

    // 对没有登录的先登录
    if (!user?.isLogin()) {
      Toast.info({ content: '请先登录！' });
      goToLoginPage({ url: '/subPages/user/wx-auth/index' });
      return;
    }

    if (!isPay) {
      downloading[index] = true;
      setDownloading([...downloading]);

      if(!item?.url) return;
      const url = item.url;
      const extension = item?.extension;

      downloader?.download(url, true).then((path) => {
        wx.openDocument({
          filePath: path,
          fileType: extension, // 微信支持下载文件类型：doc, docx, xls, xlsx, ppt, pptx, pdf
          success(res) {
          },
          fail(error) {
            setErrorMsg("小程序暂不支持下载此类文件");
            console.error(error.errMsg);
          },
        });
      }).catch((error) => {
        setErrorMsg(["下载失败"]);
        console.error(error.errMsg)
      }).finally(() => {
        setTimeout(() => {
          setErrorMsg("");
        }, 3000);
        downloading[index] = false;
        setDownloading([...downloading]);
      });
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

  useEffect(() => {
    if(errorMsg !== '') {
      setTimeout(() => {
        setErrorMsg("");
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
            {/* <Text className={styles.Text} onClick={() => onPreviewer(item.url)}>浏览</Text> */}
            { downloading[index] ?
              <Spin type="spinner" /> :
              <Text onClick={() => onDownLoad(item, index)}>下载</Text>
            }
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
        { errorMsg !== "" && (
            <View className={styles.errorMsgWrapper}>
              <Icon className={styles.tipsIcon} size={20} name={'WrongOutlined'}></Icon>
              <Text className={styles.errorMessage}>{errorMsg}</Text> 
            </View>
          )
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

export default inject('user')(observer(Index));
