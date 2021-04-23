
/**
 * 通用上传组件、支持图片、附件、视频等的上传和展示
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

  // 执行上传
  const upload = () => {
    Taro.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: 'https://discuzv3-dev.dnspod.dev/apiv3/attachments',
          filePath: tempFilePaths[0],
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
              }
            })()
          },
          success(res) {
            switch(type) {
              case THREAD_TYPE.image:
                images.body.push({
                  thumbUrl: tempFilePaths[0],
                  ...res.data
                });
                setPostData({images});
                break;
              case THREAD_TYPE.file:
                files.body.push({
                  thumbUrl: tempFilePaths[0],
                  ...res.data
                });
                setPostData({files});
                break;
            }
          },
          fail(res) {
            console.log(res);
          }
        })
      }
    })
  }

  // 进行附件上传
  const atta = (
    <>
      {files.body.map((item, index) => {
        return (
          <Units type='atta' filename='委托书.doc' size='16KB' />
        );
      })}

      {(type === THREAD_TYPE.file) && (<Units type='atta-upload' onUpload={upload} />)}
    </>
  );

  // 进行图片上传
  const img = (
    <View className={styles['img-container']}>
      {images.body.map((item, index) => {
        const className = (index % 2 === 0) ? styles['margin'] : '';
        return (
          <Units className={className} type='img' src={item.thumbUrl} />
        );
      })}

      {(type === THREAD_TYPE.image && images.body.length < 9) && (<Units type='img-upload' onUpload={upload} />)}
    </View>
  );

  return (
    <>
      {img}
      {atta}
    </>
  );
}));
