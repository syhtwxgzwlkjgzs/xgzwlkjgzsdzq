import React from 'react';
import Upload from '@components/upload';
import { ATTACHMENT_TYPE, ACCEPT_FILE_TYPES } from '@common/constants/thread-post';

export default function FileUpload(props) {
  const { onChange, onComplete } = props;
  const data = { type: ATTACHMENT_TYPE.file };
  return <Upload
    listType="card"
    btnText="添加附件"
    data={data}
    limit={9}
    accept={ACCEPT_FILE_TYPES.join(',')}
    onChange={onChange}
    onComplete={onComplete}
  />;
}
