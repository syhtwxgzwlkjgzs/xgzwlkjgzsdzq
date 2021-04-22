import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import H5PayBox from './h5/amount-recognized';
// @inject('site')
// @observer
export default class index extends Component {
    render() {
        // const { platform } = site;
        // if (platform === 'pc') {
        //     return <IndexPCPage/>;
        //   }
          return <H5PayBox />;
    }
}
