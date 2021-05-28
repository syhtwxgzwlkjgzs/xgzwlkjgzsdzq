import React from 'react';
import { Input, Checkbox, Radio, Icon, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import { ATTACHMENT_TYPE, ACCEPT_FILE_TYPES, ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';
import DZQUpload from '@components/upload';
import ImageUpload from '../../../../components/thread-post/image-upload';
import FileUpload from '../../../../components/thread-post/file-upload';

export const InputType = {
  INPUT: 0,
  TEXTAREA: 1,
  RADIO_GROUP: 2,
  CHECKBOX_GROUP: 3,
  PHOTO: 4,
  FILE: 5,
};

export const CreateFunctions = {
  [InputType.INPUT]: CreateInput,
  [InputType.TEXTAREA]: CreateTextArea,
  [InputType.RADIO_GROUP]: CreateRadioGroup,
  [InputType.CHECKBOX_GROUP]: CreateCheckBoxGroup,
  [InputType.PHOTO]: CreatePhotoUploader,
  [InputType.FILE]: CreateFileUploader,
};

export function CreateInput(field) {
  const { fieldsDesc, name } = field;
  return (
    <div key={name} className={layout.input}>
      <div className={layout.title}>{name}</div>
      <Input focus={true} value={field.value} placeholder={fieldsDesc} onChange={(e) => {
        field.value = e.target.value;
      }} />
    </div>
  );
}

export function CreateTextArea(field) {
  const { fieldsDesc, name } = field;
  return (
    <div key={name} className={layout.textarea}>
      <div className={layout.title}>{name}</div>
      <Input.Textarea
        autoHeight={true}
        showLimit={true}
        maxLength={30}
        value={field.value}
        placeholder={fieldsDesc}
        rows={3}
        onChange={(e) => {
          field.value = e.target.value;
        }}
      />
    </div>
  );
}

export function CreateRadioGroup(field) {
  const { fieldsExt, name } = field;
  const { options } = JSON.parse(fieldsExt);
  return (
    <div key={name} className={layout.checkbox}>
      <div className={layout.title}>{name}</div>
      <Radio.Group value={field.value} onChange={(checked) => {
        field.value = checked;
      }}
      >
        {options.map(option => (<Radio key={option.value} name={option.value}>{option.value}</Radio>))}
      </Radio.Group>
    </div>
  );
}

export function CreateCheckBoxGroup(field) {
  const { fieldsExt, name } = field;
  const { options } = JSON.parse(fieldsExt);
  return (
    <div key={name} className={layout.radio}>
      <div className={layout.title}>{name}</div>
      <Checkbox.Group value={field.value} onChange={(checked) => {
        field.value = checked;
      }}>
        {options.map(option => (<Checkbox key={option.value} name={option.value}>{option.value}</Checkbox>))}
      </Checkbox.Group>
    </div>
  );
}

const getFilePath = (ret) => {
  if (ret.code !== 0) {
    Toast.error({ content: `${ret.msg} 上传失败` });
    return false;
  }
  const { data: { file_path, attachment } } = ret;

  return `${file_path}${attachment}`;
};

export function CreatePhotoUploader(field) {
  const { name } = field;
  const data = { type: ATTACHMENT_TYPE.image };
  return (
    <div key={name} className={layout.imgUpload}>
      <div className={layout.title}>{name}</div>
      <ImageUpload listType='card'
                   btnText='上传图片'
                   data={data}
                   limit={1}
                   accept={ACCEPT_IMAGE_TYPES.join(',')}
                   onChange={(fileList) => {
                     field.value = fileList;
                   }}
                   onComplete={
                     (ret) => {
                       field.value[field.value.length - 1].thumbUrl =  getFilePath(ret);
                     }
                   }
                   beforeUpload={() => true}
                   fileList={field.value}

      >
        <div className={layout['imgUpload-dom']}>+</div>
      </ImageUpload>
    </div>
  );
}

export function CreateFileUploader(field) {
  const { name } = field;
  const data = { type: ATTACHMENT_TYPE.file };
  return (
    <div key={name} className={layout.attachmentsUpload}>
      <span className={layout['attachmentsUpload-left']}>{name}</span>
      <span className={layout['attachmentsUpload-right']}>
              <FileUpload listType='text' multiple={true}
                          btnText='上传文件'
                          data={data}
                          limit={1}
                          accept={ACCEPT_FILE_TYPES.join(',')}
                          onChange={(fileList) => {
                            field.value = fileList;
                          }}
                          onComplete={
                            (ret) => {
                              field.value[field.value.length - 1].filePath =  getFilePath(ret);
                              console.log(field.value[field.value.length - 1].filePath);
                            }
                          }
                          beforeUpload={() => true}
                          fileList={field.value}>
                <Icon size='small' name='LinkOutlined' />
                <span>{field.fieldsDesc}</span>
              </FileUpload>
            </span>
    </div>
  );
}
