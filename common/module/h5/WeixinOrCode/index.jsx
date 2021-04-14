import React from 'react';
import layout from './index.module.scss';

class WeixinOrCode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { orCodeImg, orCodeTips } = this.props;
    return (
      <div className={layout.orCode}>
        <img className={layout.orCode__img} src={orCodeImg} alt=""/>
        <p className={layout.orCode__text}>{orCodeTips}</p>
      </div>
    );
  }
}

export default WeixinOrCode;
