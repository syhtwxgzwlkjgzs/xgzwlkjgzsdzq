import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import router from 'next/router'

@inject('site')
export default class Close extends React.Component {

  render() {
    const { site } = this.props;
    const {closeSiteConfig} = site;
    console.log(closeSiteConfig);
    return (
      <div className='index'>
        <h1>关闭站点</h1>
        {closeSiteConfig && <p>{closeSiteConfig.detail}</p>}
      </div>
    );
  }
}
