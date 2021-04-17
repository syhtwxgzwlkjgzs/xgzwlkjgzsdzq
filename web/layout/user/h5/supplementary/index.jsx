import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Checkbox, Radio, Upload, Button, Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';


@inject('site')
@inject('user')
@inject('thread')
@observer
class SupplementaryH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      textareaValue: '',
      radioValue: '',
      checkboxValue: [],
    };
  }
  setInputValue = (e) => {
    const { value } = e.target;
    this.setState({
      inputValue: value,
    });
  }
  setTextareaValue = (e) => {
    const { value } = e.target;
    this.setState({
      textareaValue: value,
    });
  }
  setRadioValue = (value) => {
    console.log(value);
    this.setState({
      radioValue: value,
    });
  }
  setCheckboxValue = (value) => {
    console.log(value);
    this.setState({
      checkboxValue: value,
    });
  }

  render() {
    const { inputValue, textareaValue, radioValue, checkboxValue } = this.state;
    return (
        <div className={layout.content}>
          {/* 输入框 start */}
          <div className={layout.input}>
            <div className={layout.title}>1.单行文本框</div>
            <Input focus={true} value={inputValue} placeholder="请输入内容" onChange={this.setInputValue} />
          </div>
          {/* 输入框 end */}
          {/* 图片上传 start */}
          <div className={layout.imgUpload}>
            <div className={layout.title}>2.图片</div>
            <Upload listType='card' multiple={true} customRequest={() => {
              console.log('上传');
            }}>
              <div className={layout['imgUpload-dom']}>+</div>
            </Upload>
          </div>
          {/* 图片上传 end */}
          {/* 附件上传 start */}
          <div className={layout.attachmentsUpload}>
            <span className={layout['attachmentsUpload-left']}>3.附件</span>
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
          {/* 多行输入框 start */}
          <div className={layout.textarea}>
            <div className={layout.title}>4.多行文本框</div>
            <Input.Textarea
              autoHeight={true}
              showLimit={true}
              maxLength={30}
              value={textareaValue}
              placeholder="请输入内容"
              rows={3}
              onChange={this.setTextareaValue}
            />
          </div>
          {/* 多行输入框 end */}
          {/* 单选 start */}
          <div className={layout.radio}>
            <div className={layout.title}>4.多选</div>
            <Checkbox.Group value={checkboxValue} onChange={this.setCheckboxValue}>
              <Checkbox name="1">深圳</Checkbox>
              <Checkbox name="2">广州</Checkbox>
            </Checkbox.Group>
          </div>
          {/* 单选 end */}
          {/* 多选 start */}
          <div className={layout.checkbox}>
            <div className={layout.title}>5.单选</div>
            <Radio.Group value={radioValue} onChange={this.setRadioValue}>
              <Radio name="1">深圳</Radio>
              <Radio name="2">广州</Radio>
            </Radio.Group>
          </div>
          {/* 多选 end */}
          {/* 提交 start */}
          <Button className={layout.button} type="primary" onClick={() => {
            console.log('注册');
          }}>
            注册
          </Button>
          {/* 提交 end */}
        </div>
    );
  }
}

export default withRouter(SupplementaryH5Page);
