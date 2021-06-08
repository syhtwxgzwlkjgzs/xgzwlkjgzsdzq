
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
  const { webConfig, envConfig } = site;
  const localData = JSON.parse(JSON.stringify(postData));

  const { images, files, audio } = localData;

  // 检查选中附件、图片的合法性，合法则可以上传
  const checkWithUpload = async (cloneList, isImage = true) => {
    Taro.showLoading({ title: '上传中', mask: true });

    let isAllLegal = true; // 状态：此次上传图片是否全部合法
    const uploadPromise = [];
    const { supportFileExt, supportImgExt, supportMaxSize } = webConfig?.setAttach;
    const supportExt = isImage ? supportImgExt : supportFileExt; // 支持的文件格式
    const showList = isImage ? images : files; // 已上传文件列表
    const remainLength = 9 - Object.keys(showList).length; // 剩余可传数量

    // 1 删除多余文件
    cloneList.splice(remainLength, cloneList.length - remainLength);

    // 2 校验文件合法性
    for (let i = 0; i < cloneList.length; i++) {
      const fileType = cloneList[i].path.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
      const fileSize = cloneList[i].size;
      const isLegalType = supportExt.toLocaleLowerCase().includes(fileType);
      const isLegalSize = fileSize > 0 && fileSize < supportMaxSize * 1024 * 1024;

      if (isLegalType && isLegalSize) {
        uploadPromise.push(upload(cloneList[i]));
      } else {
        cloneList.splice(i, 1);
        i--;
        isAllLegal = false;
      }
    }

    // 3 等待上传完成
    Promise.all(uploadPromise)
      .then(() => {
        Taro.hideLoading();
        !isAllLegal && Taro.showToast({
          title: `仅支持${supportExt}格式，且0~${supportMaxSize}MB的${isImage ? '图片' : '文件'}`,
          icon: 'none'
        });
      })
  }

  // 执行上传
  const upload = (file) => {
    return new Promise((resolve, reject) => {
      const tempFilePath = file.path || file.tempFilePath;
      const token = locals.get(constants.ACCESS_TOKEN_NAME);
      Taro.uploadFile({
        url: `${envConfig.COMMOM_BASE_URL}/apiv3/attachments`,
        filePath: tempFilePath,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
          'authorization': `Bearer ${token}`
        },
        formData: {
          'type': (() => {
            switch (type) {
              case THREAD_TYPE.image: return 1;
              case THREAD_TYPE.file: return 0;
            }
          })()
        },
        success(res) {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data).Data;
            switch (type) {
              case THREAD_TYPE.image:
                images[data.id] = {
                  thumbUrl: tempFilePath,
                  ...data,
                };
                setPostData({ images });
                break;
              case THREAD_TYPE.file:
                files[data.id] = {
                  thumbUrl: tempFilePath,
                  name: file.name,
                  size: file.size,
                  ...data,
                };
                setPostData({ files });
                break;
            }
          } else {
            console.log(res);
          }
          resolve();
        },
        fail(res) {
          console.log(res);
        }
      });
    });
  };

  // 选择图片
  const chooseImage = () => {
    Taro.chooseImage({
      count: 9,
      success(res) {
        checkWithUpload(res.tempFiles)
      }
    });
  }

  // 选择附件
  const chooseFile = () => {
    Taro.chooseMessageFile({
      count: 9,
      success(res) {
        checkWithUpload(res.tempFiles, false)
      }
    });
  }

  // 进行附件上传
  const atta = (
    <>
      {Object.values(files).map((item, index) => {
        return (
          <Units key={index} type='atta' filename={item.name} size={item.size ? `${Math.ceil(item.size / 1024)}KB` : ''} onDelete={() => {
            delete files[item.id];
            setPostData({ files });
          }} />
        );
      })}

      {(type === THREAD_TYPE.file && Object.values(files).length < 9) && (<Units type='atta-upload' onUpload={chooseFile} />)}
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
            setPostData({ images });
          }} />
        );
      })}

      {(type === THREAD_TYPE.image && Object.values(images).length < 9) && (<Units type='img-upload' onUpload={chooseImage} />)}
    </View>
  );

  // 录音并上传
  const audioRecord = (type === THREAD_TYPE.voice && !audio.id) && (
    <AudioRecord duration={60} onUpload={(file) => { audioUpload(file) }} />
  );

  // 录音音频
  const audioPlayer = (audio?.mediaUrl) && (
    <Audio src={audio.mediaUrl} onDelete={() => { setPostData({ audio: {} }); }} />
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
