import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import { Input, Checkbox, Radio, Upload, Button, Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';


@inject('site')
@inject('user')
@inject('thread')
@inject('supplementary')
@observer
class SupplementaryPage extends React.Component {
  constructor(props){
    super(props);
  }

  handleNameChange = (e) => {
    this.props.supplementary.name = e.target.value;
  }

  handleCauseChange = (e) => {
    this.props.supplementary.cause = e.target.value;
  }

  handleGenderChange = (gender) => {
    this.props.supplementary.gender = gender;
  }

  handleInterestChange = (interest) => {
    this.props.supplementary.interest = interest;
  }

  render() {
    const { supplementary, site } = this.props;
    const { platform } = site;

    const InputItem = ({index = 1}) => (
        <View className={layout.item}>
          <View className={layout.input}>
            <View className={layout.label}>{index}.姓名</View>
            <Input className={layout.input_value} value={supplementary.name} placeholder="请输入姓名" onChange={this.handleNameChange} />
          </View>
        </View>
    );
    const TextareaItem = ({index = 2}) => (
      <View className={layout.item}>
        <View className={layout.textarea}>
          <View className={layout.label}>{index}.注册原因</View>
          <Input.Textarea
            // autoHeight
            showLimit
            maxLength={30}
            className={layout.textarea_item}
            value={supplementary.cause}
            placeholder="请输入注册原因"
            rows={3}
            onChange={this.handleCauseChange}
          />
        </View>
      </View>
    );
    const CheckboxItem = ({index = 3}) => (
      <View className={layout.item}>
        <View className={layout.checkbox}>
          <View className={layout.label}>{index}.性别</View>
          <Radio.Group value={supplementary.gender} onChange={this.handleGenderChange}>
            <Radio name="1">男</Radio>
            <Radio name="2">女</Radio>
          </Radio.Group>
        </View>
      </View>
    );
    const RadioItem = ({index = 4}) => (
      <View className={layout.item}>
        <View className={layout.checkbox}>
          <View className={layout.label}>{index}.爱好</View>
          <Checkbox.Group value={supplementary.interest} onChange={this.handleInterestChange}>
            <Checkbox name="1">复选框</Checkbox>
            <Checkbox name="2">复选框</Checkbox>
          </Checkbox.Group>
        </View>
      </View>
    );
    const ImgUploadItem = ({index = 5}) => (
      <View className={layout.item}>
        <View className={layout.imgUpload}>
          <View className={layout.label}>{index}.照片</View>
          <Upload listType='card' multiple customRequest={() => {
            console.log('上传');
          }}>
            <View className={layout['imgUpload-dom']}>+</View>
          </Upload>
        </View>
      </View>
    );
    const AttachmentsUploadItem = ({index = 6}) => (
      <View className={layout.item}>
        <View className={layout.attachmentsUpload}>
          <View className={layout['attachmentsUpload-left']}>{index}.附件</View>
          <View className={layout['attachmentsUpload-right']}>
            <Upload listType='text' multiple customRequest={() => {
              console.log('上传');
            }}>
            <Icon size='small' name='PaperClipOutlined' />
            <Text>上传附件</Text>
            </Upload>
          </View>
        </View>
      </View>
    );

    return (
      <View className={layout.container}>
        <View className={layout.content}>
          {/* 输入框 start */}
            <InputItem/>
          {/* 输入框 end */}
          {/* 多行输入框 start */}
            <TextareaItem/>
          {/* 多行输入框 end */}
          {/* 单选 start */}
            <CheckboxItem/>
          {/* 单选 end */}
          {/* 多选 start */}
            <RadioItem/>
          {/* 多选 end */}
          {/* 图片上传 start */}
            <ImgUploadItem/>
          {/* 图片上传 end */}
          {/* 附件上传 start */}
            <AttachmentsUploadItem/>
          {/* 附件上传 ennd */}
          {/* 提交 start */}
          <Button className={layout.button} type="primary" onClick={() => {
            console.log('注册');
          }}>
            提交
          </Button>
          {/* 提交 end */}
        </View>
      </View>
    );
  }
}

export default SupplementaryPage;
