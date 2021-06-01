import React from 'react';
import BaseLayoutControl from './control';

class BaseLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <BaseLayoutControl {...this.props} />;
  }
}

export default BaseLayout;
