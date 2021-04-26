import React from 'react';
import Upload from '@components/upload';
import { ATTACHMENT_TYPE, ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';

export default function ImageUpload(props) {
  const { onChange, onComplete, fileList } = props;
  const data = { type: ATTACHMENT_TYPE.image };
  return <Upload
    listType="card"
    btnText="上传图片"
    data={data}
    limit={9}
    accept={ACCEPT_IMAGE_TYPES.join(',')}
    onChange={onChange}
    onComplete={onComplete}
    fileList={fileList}
  />;
}
