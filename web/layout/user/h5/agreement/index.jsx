import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import PcBodyWrap from '../components/pc-body-wrap';
import * as protocolType from '../constants/protocol';

@inject('site')
@inject('user')
@inject('thread')
@inject('commonLogin')
@inject('nicknameBind')
@observer
class BindNicknameH5Page extends React.Component {
  render() {
    const { router } = this.props;
    const { type } = router.query;
    const protocolData = protocolType[type];
    return (
      <PcBodyWrap>
      <div className={layout.pc_container}>
        <Header/>
        <div className={layout.pc_content}>
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
        </div>
        </div>
      </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(BindNicknameH5Page);
