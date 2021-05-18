import React from 'react';
import { inject } from 'mobx-react';
import { Popup } from '@discuzq/design';
import layout from './index.module.scss';
import * as protocolType from '../../constants/protocol';

@inject('commonLogin')
class PopProtocol extends React.Component {
  render() {
    const { protocolVisible, protocolStatus } = this.props;
    const { commonLogin } = this.props;
    const protocolData = protocolType[protocolStatus];
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
          {
            protocolData?.content?.map((item, index) =>  (
              <div key={index}>
                <div className={layout.item_title}>
                  {item.title}
                </div>
                {
                  item?.content?.map((text, textIndex) => (
                    <div key={textIndex} className={layout.item_content}>
                      {text}
                    </div>
                  ))
                }
              </div>
            )
            )
          }
          <div className={layout.bottom} onClick={() => commonLogin.setProtocolVisible(false)}>
            关闭
          </div>
        </div>
      </Popup>
    );
  }
}

export default PopProtocol;
