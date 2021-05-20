import React from 'react';
import { Upload, Button, Icon } from '@discuzq/design';
import { createAttachment } from '@common/server';
import styles from './index.module.scss';
import classNames from 'classnames';

export default function DzqUpload(props) {
  const {
    listType,
    fileList,
    btnText,
    isCustomUploadIcon,
    limit,
    children,
    onRemove,
    beforeUpload,
    onChange,
    onSuccess,
    onFail,
    onComplete,
    data,
    accept,
    className,
  } = props;
  const multiple = limit > 1;

  const post = async (file, list, updater) => { // file, list, updater
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    Object.keys(data).forEach((item) => {
      formData.append(item, data[item]);
    });
    // TODO:进度条目前有问题
    const ret = await createAttachment(formData, () => { // progressEvent
      // const complete = (progressEvent.loaded / progressEvent.total * 100 | 1);
      // file.status = 'uploading';
      // // file.percent += complete;
      // updater(list);
    });
    if (ret.code === 0) {
      onSuccess(ret, file);
      onComplete(ret, file);
      file.status = 'success';
      updater(list);
    } else {
      onFail(ret, file);
      onComplete(ret, file);
      file.status = 'error';
      updater(list);
      return false;
    }
    return ret;
  };

  // TODO: 因为上传组件不支持传class和style，所以在外面增加了一层dom
  const clsName = isCustomUploadIcon ? `${styles['dzq-custom-upload']} ${styles['dzq-upload-reset']} ${className}` : `${styles['dzq-upload-reset']}  ${className}`;

  return (
    <div className={clsName}>
      <Upload
        listType={listType}
        fileList={fileList}
        limit={limit}
        multiple={multiple}
        onRemove={(file) => {
          onRemove(file);
        }}
        beforeUpload={(cloneList, showFileList) => {
          beforeUpload(cloneList, showFileList);
          return true;
        }}
        onChange={(fileList) => {
          onChange(fileList);
        }}
        customRequest={post}
        accept={accept}
      >
        {!isCustomUploadIcon && (
          <Button type='text' className={classNames(styles['flex-column-center'], styles['text-grey'])}>
            <Icon name="PlusOutlined" size={16}></Icon>
            <span className="dzq-upload__btntext">{btnText}</span>
          </Button>
        )}
        {isCustomUploadIcon && children}
      </Upload>
    </div>
  );
}

/**
 * 添加附件可以用 listType = list 的类型
 * 图片可以使用 listType = card 的类型
 */
DzqUpload.defaultProps = {
  data: {
    type: 1, // 默认传的是图片类型
  }, // 上传要附加的数据
  listType: 'list', // 显示类型
  fileList: [], // 展示的文件
  btnText: '', // 显示的上传按钮的文案
  limit: 1, // 上传限制的个数
  accept: '', // 上传允许的类型
  isCustomUploadIcon: false, // 是否自定义上传按钮
  onRemove: () => { },
  beforeUpload: () => { },
  onChange: () => { },
  onSuccess: () => { },
  onFail: () => { },
  onComplete: () => {},
};
