import React from 'react';
import { inject } from 'mobx-react';
import layout from './index.module.scss';
import { copyright } from '../../constants/copyright';

@inject('site')
class PcBodyWrap extends React.Component {
  render() {
    const { children, site } = this.props;
    const { platform } = site;
    return (
      <div className={platform === 'h5' ? '' : layout.pc_body_background}>
        {children}
        {
          platform === 'h5'
            ? <></>
            : <div className={layout.pc_bottom}>{copyright}</div>
        }
      </div>
    );
  }
}

export default PcBodyWrap;
