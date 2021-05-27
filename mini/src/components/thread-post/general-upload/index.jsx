
/**
 * 通用上传组件、支持图片、附件、录音等的上传和展示
 */
import React from 'react';
import Taro from '@tarojs/taro';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import AudioRecord from '@discuzq/design/dist/components/audio-record/index';
import Audio from '@discuzq/design/dist/components/audio/index';
import { Units } from '@components/common';
import styles from './index.module.scss';
import locals from '@common/utils/local-bridge';
import constants from '@common/constants';
import { THREAD_TYPE } from '@common/constants/thread-post';

export default inject('threadPost', 'site')(observer(({ type, threadPost, site, audioUpload }) => {
  const { postData, setPostData } = threadPost;
  const { webConfig } = site;

  const localData = JSON.parse(JSON.stringify(postData));

  const { images, files, audio } = localData;

  // 检查选中附件、图片的合法性，合法则可以上传
  const checkWithUpload = (tempFiles, type) => {
    // 站点支持的附件类型、图片类型、尺寸大小
    const { supportFileExt, supportImgExt, supportMaxSize } = webConfig?.setAttach;

    if (type === THREAD_TYPE.file) {
      const tempFile = tempFiles[0]; // 附件上传一次只能传一个
      const fileType = tempFile.name.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
      const fileSize = tempFile.size;
      const isLegalType = supportFileExt.toLocaleLowerCase().includes(fileType);
      const isLegalSize = supportMaxSize * 1024 * 1024 > fileSize;

      if (!isLegalType) {
        Taro.showToast({ title: `仅支持${supportFileExt}格式的附件`, icon: 'none' });
        return;
      }
      if (!isLegalSize) {
        Taro.showToast({ title: `仅支持0 ~ ${supportMaxSize}MB的附件`, icon: 'none' });
        return;
      }

      upload(tempFile);

    } else if (type === THREAD_TYPE.image) {
      // 剔除超出数量9的多余图片
      console.log(`images`, images, Object.keys(images).length)
      const remainLength = 9 - Object.keys(images).length; // 剩余可传数量
      tempFiles.splice(remainLength, tempFiles.length - remainLength);

      let isAllLegal = true; // 状态：此次上传图片是否全部合法
      tempFiles.forEach((item, index) => {
        const imageType = item.path.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
        const imageSize = item.size;
        const isLegalType = supportImgExt.toLocaleLowerCase().includes(imageType);
        const isLegalSize = supportMaxSize * 1024 * 1024 > imageSize;

        // 存在不合法图片时，从上传图片列表删除
        if (!isLegalType || !isLegalSize) {
          tempFiles.splice(index, 1);
          isAllLegal = false;
          return;
        }

        upload(item);
      });

      !isAllLegal && Taro.showToast({
        title: `仅支持${supportImgExt}格式，且0~${supportMaxSize}MB的图片`, icon: 'none'
      });
    }

    return true;
  }

  // 执行上传
  const upload = (file) => {
    console.log('upload', file);
    const tempFilePath = file.path || file.tempFilePath;
    const token = locals.get(constants.ACCESS_TOKEN_NAME);
    console.log(tempFilePath);
    Taro.uploadFile({
      url: `https://discuzv3-dev.dnspod.dev//apiv3/attachments`,
      filePath: tempFilePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${token}`
      },
      formData: {
        'type': (() => {
          console.log(type);
          console.log(THREAD_TYPE.voice);
          switch(type) {
            case THREAD_TYPE.image: return 1;
            case THREAD_TYPE.file: return 0;
            // case THREAD_TYPE.voice: return 3;
          }
        })()
      },
      success(res) {
        console.log(res);
        const data = JSON.parse(res.data).Data;
        switch(type) {
          case THREAD_TYPE.image:
            images[data.id] = {
              thumbUrl: tempFilePath,
              ...data,
            };
            setPostData({images});
            break;
          case THREAD_TYPE.file:
            files[data.id] = {
              thumbUrl: tempFilePath,
              name: file.name,
              size: file.size,
              ...data,
            };
            setPostData({files});
            break;
          // case THREAD_TYPE.voice:
          //   audio = {
          //     thumbUrl: tempFilePath,
          //     ...data,
          //   };
          //   setPostData({audio});
          //   break;
        }
      },
      fail(res) {
        console.log(res);
      }
    });
  }

  // 选择图片
  const chooseImage = () => {
    Taro.chooseImage({
      count: 9,
      success(res) {
        checkWithUpload(res.tempFiles, THREAD_TYPE.image)
      }
    });
  }

  // 选择附件
  const chooseFile = () => {
    Taro.chooseMessageFile({
      count: 1,
      success(res) {
        checkWithUpload(res.tempFiles, THREAD_TYPE.file)
      }
    });
  }

  // 进行附件上传
  const atta = (
    <>
      {Object.values(files).map((item, index) => {
        return (
          <Units key={index} type='atta' filename={item.name} size={`${Math.ceil(item.size / 1024)}KB`} onDelete={() => {
            delete files[item.id];
            setPostData({files});
          }} />
        );
      })}

      {(type === THREAD_TYPE.file) && (<Units type='atta-upload' onUpload={chooseFile} />)}
    </>
  );

  // 进行图片上传
  const img = (
    <View className={styles['img-container']}>
      {Object.values(images).map((item, index) => {
        const className = (index % 2 === 0) ? styles['margin'] : '';
        return (
          <Units className={className} type='img' src={item.thumbUrl} onDelete={() => {
            delete images[item.id];
            setPostData({images});
          }} />
        );
      })}

      {(type === THREAD_TYPE.image && Object.values(images).length < 9) && (<Units type='img-upload' onUpload={chooseImage} />)}
    </View>
  );

  // 录音并上传
  const audioRecord = (type === THREAD_TYPE.voice && !audio.id) && (
    <AudioRecord duration={60} onUpload={(file) => {audioUpload(file)}} />
  );

  // 录音音频
  const audioPlayer = (audio.id) && (
    <Audio src={audio.mediaUrl} onDelete={() => {setPostData({audio: {}});}} />
  );


  return (
    <>
      {atta}
      {img}
      {audioRecord}
      {audioPlayer}
    </>
  );
}));
