import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import h5layout from './index.module.scss';
import pclayout from './pc.module.scss';
import { getSignInFields, setSignInFields } from '@server';
import PcBodyWrap from '../components/pc-body-wrap';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { toJS, set, observable, action } from 'mobx';
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
      this.props.supplementary.fields = res.data;
      this.props.supplementary.values = this.props.supplementary.fields?.map((field) => {
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
        return ({ ...field, value: defaultValue });
      });
    } catch (e) {
      Toast.error({
        content: e,
        duration: 2000,
      });
    }
  }

  createComponent(field) {
    const { site: { platform } } = this.props;
    const layout = platform === 'h5' ? h5layout : pclayout;
    const f = CreateFunctions[field.type];
    if (!f) return (<></>);
    return f(field, layout);
  }


  processData =() => {
    const { fields, values } = this.props.supplementary;
    return values.map((v, index) => {
      if (v.required === 1 && v.value.length === 0) {
        throw new Error(`${v.name}字段未填写`);
      }
      let fieldsExt; let options;
      if (v.value.length) {
        switch (v.type) {
          case InputType.INPUT:
          case InputType.TEXTAREA:
            fieldsExt = v.value;
            break;
          case InputType.FILE:
          case InputType.PHOTO:
            fieldsExt = v.value.map((file) => {
              const { url, id, uuid, name } = file;
              return { url, id, uuid, name };
            });
            break;
          case InputType.RADIO_GROUP:
            ({ options } = JSON.parse(v.fieldsExt));
            fieldsExt = { options: options.map((option) => {
              option.checked = option.value === v.value;
              return option;
            }) };
            break;
          case InputType.CHECKBOX_GROUP:
            const valueSet = new Set(v.value);
            ({ options } = JSON.parse(v.fieldsExt));
            fieldsExt = { options: options.map((option) => {
              option.checked = valueSet.has(option.value);
              return option;
            }) };
            break;
        }
      }
      fieldsExt = JSON.stringify(fieldsExt);
      return { ...fields[index], fieldsExt };
    });
  };
  render() {
    const { values } = this.props.supplementary;
    const { site } = this.props;
    const { platform } = site;
    const layout = platform === 'h5' ? h5layout : pclayout;
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
            {values?.map(field => this.createComponent(field))}
            <Button className={layout.button} type='primary' onClick={() => {
              try {
                const data = this.processData(values);
                setSignInFields({ data: { data } })
                  .then(() => {
                    Toast.success({
                      content: '提交成功',
                      duration: 2000,
                    });
                    setTimeout(() => {
                      // todo 跳转逻辑
                      window.location.href = '/';
                    }, 1000);
                  });
              } catch (e) {
                // todo 优化错误处理
                console.log(e);
                Toast.error({
                  content: e.message || e,
                  duration: 2000,
                });
              }
            }}>
              提交
            </Button>
          </div>
        </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(SupplementaryH5Page);
