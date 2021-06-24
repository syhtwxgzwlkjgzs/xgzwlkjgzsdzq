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
@inject('commonLogin')
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

  // 附件、图片上传之前
  beforeUpload = (cloneList, showFileList, type) => {
    const { webConfig } = this.props.site;
    if (!webConfig) return false;
    // 站点支持的文件类型、文件大小
    const { supportFileExt, supportImgExt, supportMaxSize } = webConfig.setAttach;
    if (type === InputType.FILE) {
      // 当前选择附件的类型大小
      const fileType = cloneList[0].name.match(/\.(.+)$/i)[1].toLocaleLowerCase();
      const fileSize = cloneList[0].size;
      // 判断合法性
      const isLegalType = supportFileExt.toLocaleLowerCase().includes(fileType);
      const isLegalSize = fileSize > 0 && fileSize < supportMaxSize * 1024 * 1024;
      if (!isLegalType) {
        Toast.info({ content: '当前文件类型暂不支持' });
        return false;
      }
      if (!isLegalSize) {
        Toast.info({ content: `上传附件大小范围0 ~ ${supportMaxSize}MB` });
        return false;
      }
    } else if (type === InputType.PHOTO) {
      // 剔除超出数量9的多余图片
      const remainLength = 9 - showFileList.length; // 剩余可传数量
      cloneList.splice(remainLength, cloneList.length - remainLength);

      let isAllLegal = true; // 状态：此次上传图片是否全部合法
      cloneList.forEach((item, index) => {
        const arr = item.name.split('.').pop();
        const imageType = arr.toLocaleLowerCase();
        const isLegalType = supportImgExt.toLocaleLowerCase().includes(imageType);

        // 存在不合法图片时，从上传图片列表删除
        if (!isLegalType) {
          cloneList.splice(index, 1);
          isAllLegal = false;
        }
      });

      !isAllLegal && Toast.info({ content: `仅支持${supportImgExt}类型的图片` });
      return true;
    }

    return true;
  };

  createComponent(field) {
    const { site: { platform } } = this.props;
    const layout = platform === 'h5' ? h5layout : pclayout;
    const beforeUpload = this.beforeUpload;
    const f = CreateFunctions[field.type];
    if (!f) return (<></>);
    return f(field, layout, beforeUpload);
  }


  processData =() => {
    const { fields, values = [] } = this.props.supplementary;
    return values?.map((v, index) => {
      if (v.required === 1) {
        if (v.value.length === 0
          || (v.value.trim && v.value.trim().length === 0)) {
          throw new Error(`${v.name}未填写`);
        }
      }

      let fieldsExt; let options;
      if (v.value.length) {
        switch (v.type) {
          case InputType.INPUT:
          case InputType.TEXTAREA:
            fieldsExt = v.value?.trim();
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
            <Button className={layout.button} type='primary' onClick={ () => {
              try {
                const data = this.processData(values);
                setSignInFields({ data: { data } })
                  .then(async () => {
                    Toast.success({
                      content: '提交成功',
                      duration: 1000,

                    });
                    const id = this.props.user?.id;
                    await this.props.user.updateUserInfo(id);
                    const { statusCode, statusMsg, needToBindPhone,
                      needToBindWechat, nickName, sessionToken } = this.props.commonLogin;

                    if (needToBindPhone) {
                      return this.props.router.push(`/user/bind-phone?sessionToken=${sessionToken}`);
                    }

                    if (needToBindWechat === true) {
                      return this.props.router.push(`/user/wx-bind-qrcode?sessionToken=${sessionToken}&loginType=${platform}&nickname=${nickName}`);
                    }
                    if (statusMsg && statusCode) {
                      return this.props.router.push(`/user/status?statusCode=${statusCode}&statusMsg=${statusMsg}`);
                    }
                    window.location.href = '/';
                  });
              } catch (e) {
                // todo 优化错误处理
                Toast.error({
                  content: e.message || e,
                  duration: 2000,
                });
              }
            }}>
              注册
            </Button>
          </div>
        </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(SupplementaryH5Page);
