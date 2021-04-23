import React from 'react';
import { inject } from 'mobx-react';
import layout from './index.module.scss';

@inject('site')
class WeixinQrCode extends React.Component {
  render() {
    const { orCodeImg, orCodeTips, site } = this.props;
    const { platform } = site;
    return (
      <div className={platform === 'h5' ? layout.orCode : layout.pc_orCode}>
        <div className={platform === 'h5' ? layout.orCode__img : layout.pc_orCode__img}>
          {
            orCodeImg
              ? <img src={orCodeImg} alt=""/>
              : <></>
          }
        </div>
        <p className={platform === 'h5' ? layout.orCode__text : layout.pc_orCode__text}>{orCodeTips}</p>
      </div>
    );
  }
}

export default WeixinQrCode;
