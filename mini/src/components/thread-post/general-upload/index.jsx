
/**
 * 通用上传组件、支持图片、附件、录音等的上传和展示
 */
import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import { AudioRecord, Audio } from '@discuzq/design';
import { Units } from '@components/common';
import styles from './index.module.scss';
import { THREAD_TYPE } from '@common/constants/thread-post';

export default inject('threadPost')(observer(({type, threadPost, audioUpload}) => {
  const { postData, setPostData } = threadPost;

  const localData = JSON.parse(JSON.stringify(postData));

  const { images, files, audio } = localData;

  // 执行上传
  const upload = (file) => {
    console.log('upload', file);
    const tempFilePath = file.path || file.tempFilePath;
    console.log(tempFilePath);
    Taro.uploadFile({
      url: `${window.location.origin}/apiv3/attachments`,
      filePath: tempFilePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiIxNmUxZTAyNTEzZmNmNmI3YzAwYTIyZGIxNDY3NmQ0ZTIwMWZkYmQ5NzM0YTQ0Y2RiZWE3NjZhOGQ3YzZiMzUxYWMyYTI0MjVkZWVmZWQwNiIsImlhdCI6MTYxOTM0MjEyNSwibmJmIjoxNjE5MzQyMTI1LCJleHAiOjE2MjE5MzQxMjUsInN1YiI6IjEiLCJzY29wZXMiOltudWxsXX0.RZrWPw5xNljl8jexv6CCVni0wEGhb6g5zzsgCULa_3fHvCzrUSF0YMhCduCCTdnbKmbegVsVNMCVqDzJdMexgPD-hIUL9zouB4H7Ohy5dE6KIQpyrV08NP-27A5CUyVG-T7r1hMKkAVn0hBKY4zF3-q0RsN16jV4hLJtzyPfuOSeA92umoBFqsNnn-9tR5TTppkHs1-jJPgbGn4FPpxFbrEbIB9kMdYh_kShQ2IQLGTX-xGlNZBuxNigOY7xvB2xWp9LFW9X9DlbkDLRKbU_E5Q-MMNY0laa_9tgddCzEjzE2P1TeKIOVlB_JLql9sdCWb7OaVXi8xXTZuVAxphe0w'
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
      success(res) {
        upload(res.tempFiles[0]);
      }
    });
  }

  // 选择附件
  const chooseFile = () => {
    Taro.chooseMessageFile({
      success(res) {
        upload(res.tempFiles[0]);
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
