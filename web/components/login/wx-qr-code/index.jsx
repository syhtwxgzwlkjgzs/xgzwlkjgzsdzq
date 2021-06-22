import React from 'react';
import { inject } from 'mobx-react';
import layout from './index.module.scss';
import { Icon } from '@discuzq/design';

@inject('site')
class WeixinQrCode extends React.Component {
  render() {
    const { orCodeImg, orCodeTips, isValid, site, refresh } = this.props;
    const { platform, wechatEnv } = site;
    const invalidTip = `${wechatEnv === 'miniProgram' ? '小程序码' : '二维码'}已过期，请点击刷新`;

    return (
      <div className={`${platform === 'h5' ? layout.orCode : layout.pc_orCode} ${isValid ? '' : layout.invalid}`}>
        <div className={platform === 'h5' ? layout.orCode__img : `${layout.pc_orCode__img} ${wechatEnv === 'miniProgram' ? layout.pc_orCode_mini : ''}`}>
          {
            orCodeImg
              ? <img src={orCodeImg} alt=''/>
              : <></>
          }
        </div>
        { platform === 'pc' && !isValid ? 
          <div onClick={() => refresh()} className={layout.codeMask}>
            <Icon name='RenovateOutlined' size='64' />
          </div>
          : ''
        }
        <p className={platform === 'h5' ? layout.orCode__text : layout.pc_orCode__text}>
          {isValid ? orCodeTips : invalidTip}
        </p>
      </div>
    );
  }
}

export default WeixinQrCode;
