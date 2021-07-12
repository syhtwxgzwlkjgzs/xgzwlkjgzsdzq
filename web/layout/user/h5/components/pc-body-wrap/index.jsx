import React from 'react';
import { inject } from 'mobx-react';
import layout from './index.module.scss';
import BaseLayout from '@components/base-layout';
import CopyRight from '@components/copyright';

@inject('site')
class PcBodyWrap extends React.Component {
  render() {
    const { children, site } = this.props;
    const { platform } = site;

    if (platform === 'h5') {
      return <div>{children}</div>;
    }

    return (
      <BaseLayout>
        <div className={layout.pc_body_background}>
          {children}
          <CopyRight center line />
        </div>
      </BaseLayout>
    );
  }
}

export default PcBodyWrap;
