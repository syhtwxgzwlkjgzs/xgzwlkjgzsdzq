import React from 'react';
import { inject } from 'mobx-react';
import { Popup } from '@discuzq/design';
import layout from './index.module.scss';

const PROTOCAL = {
  PRIVACY: 'privacy',
  REGISTER: 'register'
}

@inject('commonLogin')
@inject('site')
class PopProtocol extends React.Component {
  getProtocalData(type) {
    const { site } = this.props;
    const { webConfig: { agreement } } = site;
    const { privacy, privacyContent, register, registerContent } = agreement;

    let title = '';
    let content = '';

    if (type === PROTOCAL.PRIVACY) {
      title = '隐私协议';
      content = privacy ? privacyContent : '';
    } else if (type === PROTOCAL.REGISTER) {
      title = '注册协议';
      content = register ? registerContent : ''
    }

    return {
      title,
      content
    };
  }


  render() {
    const { protocolVisible, protocolStatus } = this.props;
    const { commonLogin } = this.props;
    const protocolData = this.getProtocalData(protocolStatus);

    return (
      <Popup
        position="bottom"
        visible={protocolVisible}
        onClose={() => {commonLogin.setProtocolVisible(false)}}
      >
        <div className={layout.content}>
          <div className={layout.title}>
            {protocolData.title}
          </div>
          <div className={layout.item_content}>
            <pre>
              {protocolData.content}
            </pre>
          </div>
          <div className={layout.bottom} onClick={() => commonLogin.setProtocolVisible(false)}>
            <div className={layout.bottom_content}>
              关闭
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

export default PopProtocol;
