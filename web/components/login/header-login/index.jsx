import React from 'react';
import layout from './index.module.scss';

class HeaderLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={layout.banner}>
        <img src="/admin-logo-x2.png" alt=""/>
      </div>
    );
  }
}

export default HeaderLogin;
