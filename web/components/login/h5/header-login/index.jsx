import React from 'react';
import layout from './index.module.scss';
import Header from '../../../header/index';
import { inject } from 'mobx-react';

@inject('site')
class HeaderLogin extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return (
      <>
        <Header/>
        {
          platform === 'h5'
            ? <div className={layout.banner}>
               <img src={this.props.site.siteIconSrc} alt=""/>
            </div>
            : <></>
        }
      </>
    );
  }
}

export default HeaderLogin;
