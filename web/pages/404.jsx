import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPCPage from '@layout/404/pc';
import IndexH5Page from '@layout/404/h5';

@inject('site')
@observer
class Custom404 extends React.Component {
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

export default Custom404;