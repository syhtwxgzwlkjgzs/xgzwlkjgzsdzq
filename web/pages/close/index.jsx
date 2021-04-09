import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class Close extends React.Component {
  render() {
    const { site } = this.props;
    const { closeSiteConfig } = site;
    console.log(closeSiteConfig);
    return (
      <div className='index'>
        <h1>关闭站点</h1>
        {closeSiteConfig && <p>{closeSiteConfig.detail}</p>}
      </div>
    );
  }
}

export default Close;
