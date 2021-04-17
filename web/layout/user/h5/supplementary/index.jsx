import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Checkbox, Radio, Upload, Button, Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';


@inject('site')
@inject('user')
@inject('thread')
@inject('supplementary')
@observer
class SupplementaryH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
    const { supplementary } = this.props;

    return (
        <div className={layout.content}>
          {/* 输入框 start */}
          <div className={layout.input}>
            <div className={layout.title}>姓名</div>
            <Input focus={true} value={supplementary.name} placeholder="请输入姓名" onChange={this.handleNameChange} />
          </div>
          {/* 输入框 end */}
          {/* 多行输入框 start */}
          <div className={layout.textarea}>
            <div className={layout.title}>注册原因</div>
            <Input.Textarea
              autoHeight={true}
              showLimit={true}
              maxLength={30}
              value={supplementary.cause}
              placeholder="请输入注册原因"
              rows={3}
              onChange={this.handleCauseChange}
            />
          </div>
          {/* 多行输入框 end */}
          {/* 单选 start */}
          <div className={layout.checkbox}>
            <div className={layout.title}>性别</div>
            <Radio.Group value={supplementary.gender} onChange={this.handleGenderChange}>
              <Radio name="1">男</Radio>
              <Radio name="2">女</Radio>
            </Radio.Group>
          </div>
          {/* 单选 end */}
          {/* 多选 start */}
          <div className={layout.radio}>
            <div className={layout.title}>爱好</div>
            <Checkbox.Group value={supplementary.interest} onChange={this.handleInterestChange}>
              <Checkbox name="1">复选框</Checkbox>
              <Checkbox name="2">复选框</Checkbox>
            </Checkbox.Group>
          </div>
          {/* 多选 end */}
          {/* 图片上传 start */}
          <div className={layout.imgUpload}>
            <div className={layout.title}>照片</div>
            <Upload listType='card' multiple={true} customRequest={() => {
              console.log('上传');
            }}>
              <div className={layout['imgUpload-dom']}>+</div>
            </Upload>
          </div>
          {/* 图片上传 end */}
          {/* 附件上传 start */}
          <div className={layout.attachmentsUpload}>
            <span className={layout['attachmentsUpload-left']}>附件</span>
            <span className={layout['attachmentsUpload-right']}>
              <Upload listType='text' multiple={true} customRequest={() => {
                console.log('上传');
              }}>
                <Icon size='small' name='LinkOutlined' />
                <span>上传附件</span>
              </Upload>
            </span>
          </div>
          {/* 附件上传 ennd */}
          {/* 提交 start */}
          <Button className={layout.button} type="primary" onClick={() => {
            console.log('注册');
          }}>
            提交
          </Button>
          {/* 提交 end */}
        </div>
    );
  }
}

export default withRouter(SupplementaryH5Page);
