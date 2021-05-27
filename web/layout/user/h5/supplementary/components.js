import React from 'react';
import { Input, Checkbox, Radio, Upload,  Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import { ATTACHMENT_TYPE, ACCEPT_FILE_TYPES, ACCEPT_IMAGE_TYPES } from '@common/constants/thread-post';

export const InputType = {
  INPUT: 0,
  TEXTAREA: 1,
  RADIO_GROUP: 2,
  CHECKBOX_GROUP: 3,
  PHOTO: 4,
  FILE: 5,
};

export const CreateFunctions = [
  CreateInput,
  CreateTextArea,
  CreateRadioGroup,
  CreateCheckBoxGroup,
  CreatePhotoUploader,
  CreateFileUploader,
];
export function CreateInput(props) {
  const { values, index } = props;
  return (
    <div key={props.name} className={layout.input}>
    <div className={layout.title}>{props.name}</div>
    <Input focus={true} value={values[index]} placeholder={props.fieldsDesc} onChange={(e) => {
      values[index] = e.target.value;
    }} />
  </div>
  );
}

export function CreateTextArea(props) {
  const { values, index } = props;
  return (
    <div key={props.name} className={layout.textarea}>
      <div className={layout.title}>{props.name}</div>
      <Input.Textarea
        autoHeight={true}
        showLimit={true}
        maxLength={30}
        value={values[index]}
        placeholder={1}
        rows={3}
        onChange={(e) => {
          values[index] = e.target.value;
        }}
      />
    </div>
  );
}

export function CreateRadioGroup(props) {
  const { values, index, fieldsExt } = props;
  const { options } = JSON.parse(fieldsExt);
  return (
    <div key={props.type} className={layout.checkbox}>
      <div className={layout.title}>{props.name}</div>
      <Radio.Group value={values[index]} onChange={(checked) => {
        values[index] = checked;
      }}
      >
        {options.map(option => (<Radio key={option.value} name={option.value}>{option.value}</Radio>))}
      </Radio.Group>
    </div>
  );
}

export function CreateCheckBoxGroup(props) {
  const { values, index, fieldsExt } = props;
  const { options } = JSON.parse(fieldsExt);
  return (
    <div key={props.type} className={layout.radio}>
      <div className={layout.title}>{props.name}</div>
      <Checkbox.Group value={values[index]} onChange={(checked) => {
        values[index] = checked;
      }}>
        {options.map(option => (<Checkbox key={option.value} name={option.value}>{option.value}</Checkbox>))}
      </Checkbox.Group>
    </div>
  );
}

export function CreatePhotoUploader(props) {
  const data = { type: ATTACHMENT_TYPE.image };
  return (
    <div key={props.type} className={layout.imgUpload}>
      <div className={layout.title}>{props.name}</div>
      <Upload listType='card' multiple={true}
              data={data}
              accept={ACCEPT_IMAGE_TYPES.join(',')}
              customRequest={() => {
                console.log('上传');
              }}>
        <div className={layout['imgUpload-dom']}>+</div>
      </Upload>
    </div>
  );
}

export function CreateFileUploader(props) {
  const data = { type: ATTACHMENT_TYPE.file };
  return (
    <div key={props.type} className={layout.attachmentsUpload}>
      <span className={layout['attachmentsUpload-left']}>{props.name}</span>
      <span className={layout['attachmentsUpload-right']}>
              <Upload listType='text' multiple={true}
                      data={data}
                      accept={ACCEPT_FILE_TYPES.join(',')}
                      customRequest={() => {
                        console.log('上传');
                      }}>
                <Icon size='small' name='LinkOutlined' />
                <span>{props.fieldsDesc}</span>
              </Upload>
            </span>
    </div>
  );
}
