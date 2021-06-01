import React from 'react';
import { inject, observer } from 'mobx-react';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import List from '@components/list';
import BaseLayout from '@components/base-layout';
import layout from './index.module.scss';

@inject('site')
@inject('index')
@inject('forum')
@inject('search')
@inject('user')
@inject('invite')
@observer
class PartnerInviteWrap extends React.Component {

  render() {
    const { site, children, renderRight } = this.props;
    const { platform } = site;
    if (platform === 'h5') {
      return (
        <List className={layout.page} allowRefresh={false}>
          <HomeHeader hideInfo mode='join'/>
          { children }
        </List>
      )
    }
    return (
    <BaseLayout
      right={ renderRight }
    >
      { children }
    </BaseLayout>

    );
  }
}

export default PartnerInviteWrap;
