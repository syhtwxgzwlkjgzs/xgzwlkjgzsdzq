
/**
 * 通用上传组件、支持图片、附件等的上传和展示
 */
import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import { Units } from '@components/common';
import styles from './index.module.scss';
import { THREAD_TYPE } from '@common/constants/thread-post';

export default inject('threadPost')(observer(({type, threadPost}) => {
  const { postData, setPostData } = threadPost;

  const localData = JSON.parse(JSON.stringify(postData));

  const { images, files } = localData;

  if (!(images.body instanceof Array)) {
    images.body = [];
  }

  if (!(files.body instanceof Array)) {
    files.body = [];
  }


  const [isRecording, setIsRecording] = useState(false);

  // 执行上传
  const upload = (tempFilePath) => {
    Taro.uploadFile({
      url: 'https://discuzv3-dev.dnspod.dev/apiv3/attachments',
      filePath: tempFilePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiJmMGFjYWQ1YTZhZDIwZjk2ZDE4YTY5NDM0MWExMmNkMThjZjViMzRhOGM5OTU2OTAzNzI4YmY4NDA3YzY0ZTk5ZWIxYTI2YzE3YWJiNTA0ZiIsImlhdCI6MTYxODgwNzgyNywibmJmIjoxNjE4ODA3ODI3LCJleHAiOjE2MjEzOTk4MjcsInN1YiI6IjEiLCJzY29wZXMiOltudWxsXX0.frITzUdCYmt46ZuJ7wVWikLfnwbHA_fKde1hONWEUhA6FhhVLUNwiB1AjHNdmtq0ZLMb0pFlVYYvWiG0bkU_I9OEYH7da43dDdrzB00dcEb__5pWytSevJGVRcxeNTMZ6SqYaxGFZFM525D_NVqJ83XoI3JJ9XFCGV86BuwPVvmyOXFccip8cjEZVicP-MLiXG8XhyHl9WJ_tCtz-cqTkHNbCLJo5QN-gD_79XwRbuAQ_P5QBIAGqaip0JS6nnVSNEX_eGGWNh-J2pAvWdIUM9EC0DgNXA33X-pTln7m0mUsK1FYDMr5CC3iEFbsoqo1tmXotws8UmESdxCUn92gIg'
      },
      formData: {
        'type': (() => {
          switch(type) {
            case THREAD_TYPE.image: return 1;
            case THREAD_TYPE.file: return 0;
            case THREAD_TYPE.voice: return 3;
          }
        })()
      },
      success(res) {
        console.log(res);
        switch(type) {
          case THREAD_TYPE.image:
            images.body.push({
              thumbUrl: tempPath,
              ...res.data
            });
            setPostData({images});
            break;
          case THREAD_TYPE.file:
            files.body.push({
              ...res.data,
              thumbUrl: tempPath,
              name: file.name,
              size: file.size,
            });
            setPostData({files});
            break;
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
        upload(res.tempFiles[0].path);
      }
    });
  }

  // 选择附件
  const chooseFile = () => {
    Taro.chooseMessageFile({
      success(res) {
        upload(res.tempFiles[0].path);
      }
    });
  }

  // 执行录音
  const handleAudioRecord = () => {
    const recorderManager = Taro.getRecorderManager()
    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      upload(res.tempFilePath);
    })
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options)
  }

  // 进行附件上传
  const atta = (
    <>
      {files.body.map((item, index) => {
        return (
          <Units key={index} type='atta' filename={item.name} size={`${Math.ceil(item.size / 1024)}KB`} onDelete={() => {
            files.body.splice(index, 1);
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
      {images.body.map((item, index) => {
        const className = (index % 2 === 0) ? styles['margin'] : '';
        return (
          <Units className={className} type='img' src={item.thumbUrl} onDelete={() => {
            images.body.splice(index, 1);
            setPostData({images});
          }} />
        );
      })}

      {(type === THREAD_TYPE.image && images.body.length < 9) && (<Units type='img-upload' onUpload={chooseImage} />)}
    </View>
  );

  // 录音并上传
  const audioRecord = (type === THREAD_TYPE.voice) && (
    <Units type='audio-record' isRecording={isRecording} onStart={() => {
      setIsRecording(true);
      handleAudioRecord();
    }} />
  );

  return (
    <>
      {atta}
      {img}
      {audioRecord}
    </>
  );
}));
