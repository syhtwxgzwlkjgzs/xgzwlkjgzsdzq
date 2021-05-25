import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { Input, Checkbox, Radio, Upload, Button, Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import PcBodyWrap from '../components/pc-body-wrap';
import h5layout from './index.module.scss';
import pclayout from './pc.module.scss';


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
    const layout = platform === 'h5' ? h5layout : pclayout;

    const InputItem = ({index = 1}) => (
        <div className={layout.item}>
          <div className={layout.input}>
            <div className={layout.label}>{index}.姓名</div>
            <Input className={layout.input_value} focus={true} value={supplementary.name} placeholder="请输入姓名" onChange={this.handleNameChange} />
          </div>
        </div>
    );
    const TextareaItem = ({index = 2}) => (
      <div className={layout.item}>
        <div className={layout.textarea}>
          <div className={layout.label}>{index}.注册原因</div>
          <Input.Textarea
            autoHeight={true}
            showLimit={true}
            maxLength={30}
            className={layout.textarea_item}
            value={supplementary.cause}
            placeholder="请输入注册原因"
            rows={3}
            onChange={this.handleCauseChange}
          />
        </div>
      </div>
    );
    const CheckboxItem = ({index = 3}) => (
      <div className={layout.item}>
        <div className={layout.checkbox}>
          <div className={layout.label}>{index}.性别</div>
          <Radio.Group value={supplementary.gender} onChange={this.handleGenderChange}>
            <Radio name="1">男</Radio>
            <Radio name="2">女</Radio>
          </Radio.Group>
        </div>
      </div>
    );
    const RadioItem = ({index = 4}) => (
      <div className={layout.item}>
        <div className={layout.checkbox}>
          <div className={layout.label}>{index}.爱好</div>
          <Checkbox.Group value={supplementary.interest} onChange={this.handleInterestChange}>
            <Checkbox name="1">复选框</Checkbox>
            <Checkbox name="2">复选框</Checkbox>
          </Checkbox.Group>
        </div>
      </div>
    );
    const ImgUploadItem = ({index = 5}) => (
      <div className={layout.item}>
        <div className={layout.imgUpload}>
          <div className={layout.label}>{index}.照片</div>
          <Upload listType='card' multiple={true} customRequest={() => {
            console.log('上传');
          }}>
            <div className={layout['imgUpload-dom']}>+</div>
          </Upload>
        </div>
      </div>
    );
    const AttachmentsUploadItem = ({index = 6}) => (
      <div className={layout.item}>
        <div className={layout.attachmentsUpload}>
          <span className={layout['attachmentsUpload-left']}>{index}.附件</span>
          <span className={layout['attachmentsUpload-right']}>
            <Upload listType='text' multiple={true} customRequest={() => {
              console.log('上传');
            }}>
            <Icon size='small' name='PaperClipOutlined' />
            <span>上传附件</span>
            </Upload>
          </span>
        </div>
      </div>
    );

    return (
      <PcBodyWrap>
        <div className={layout.container}>
          {
            platform === 'h5'
              ? <HomeHeader hideInfo mode='login'/>
              : <>
                  <Header/>
                  <div className={layout.title}>填写补充信息</div>
                </>
          }
          <div className={layout.content}>
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
          </div>
        </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(SupplementaryPage);
