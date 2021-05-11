import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPCPage from '@layout/500/pc';
import IndexH5Page from '@layout/500/h5';

@inject('site')
@observer
class Custom500 extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    
    if (platform === 'pc') {
      return (
        <IndexPCPage/>
      );
    }
    return <IndexH5Page/>;

  }
}

export default Custom500;