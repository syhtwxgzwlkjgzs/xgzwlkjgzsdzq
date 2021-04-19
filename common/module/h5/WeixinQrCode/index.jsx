import React from 'react';
import layout from './index.module.scss';

class WeixinQrCode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { orCodeImg, orCodeTips } = this.props;
    return (
      <div className={layout.orCode}>
        <div className={layout.orCode__img}>
          {
            orCodeImg
              ? <img src={orCodeImg} alt=""/>
              : <></>
          }
        </div>
        <p className={layout.orCode__text}>{orCodeTips}</p>
      </div>
    );
  }
}

export default WeixinQrCode;
