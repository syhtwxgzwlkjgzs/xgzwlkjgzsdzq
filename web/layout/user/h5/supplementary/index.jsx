import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import { getSignInFields, setSignInFields } from '@server';

import { InputType, CreateFunctions } from './components';

@inject('site')
@inject('user')
@inject('thread')
@inject('supplementary')
@observer
class SupplementaryH5Page extends React.Component {
  async componentDidMount() {
    try {
      const res = await getSignInFields();
      const fields = res.data;
      this.props.supplementary.fields = fields;
      this.props.supplementary.values = fields?.map((field) => {
        let defaultValue;
        switch (field.type) {
          case InputType.RADIO_GROUP:
          case InputType.FILE:
          case InputType.PHOTO:
            defaultValue = [];
            break;
          default:
            defaultValue = '';
        }
        return { ...field, value: defaultValue };
      });
    } catch (e) {
      console.log(e);
      Toast.error({
        content: e,
        duration: 2000,
      });
    }
  }

  createComponent(field) {
    field.onChange = this.onChange;
    const f = CreateFunctions[field.type];
    if (!f) return (<></>);
    return f(field);
  }

  onChange = (index, value) => {
    const { values } = this.props.supplementary;
    values[index] = value;
  };

  processData =() => {
    const { values } = this.props.supplementary;
    return values.map((v) => {
      console.log(v.value);
      if (v.required === 1 && !v.value.length === 0) {
        throw new Error(`${v.name}字段未填写`);
      }

      if (v.value.length) {
        switch (v.type) {
          case InputType.INPUT:
          case InputType.TEXTAREA:
            v.fieldsExt = v.value;
            break;
          case InputType.FILE:
          case InputType.PHOTO:
            v.fieldsExt = v.value[0].filePath;
            break;
          case InputType.RADIO_GROUP:
          case InputType.CHECKBOX_GROUP:
            const { options } = JSON.parse(v.fieldsExt);
            options.forEach((option) => {
              if (option.value === v.value) {
                option.checked = true;
              }
            });
            v.fieldsExt = JSON.stringify({ options });

            break;
        }
      }
      delete v.value;
      return v;
    });
  }

  render() {
    const { values } = this.props.supplementary;
    return (
      <div className={layout.content}>
        {values?.map((item, index) => this.createComponent(values[index]))}
        <Button className={layout.button} type='primary' onClick={() => {
          try {
            const data = this.processData(values);
            console.log(data);
            return;
            setSignInFields({ data })
              .then(() => {
                Toast.success({
                  content: '提交成功',
                  duration: 2000,
                });
                setTimeout(() => {
                  // todo 跳转逻辑
                }, 2000);
              });
          } catch (e) {
            // todo 优化错误处理
            Toast.error({
              content: e.message,
              duration: 2000,
            });
          }
        }}>
          提交
        </Button>
      </div>
    );
  }
}

export default withRouter(SupplementaryH5Page);
