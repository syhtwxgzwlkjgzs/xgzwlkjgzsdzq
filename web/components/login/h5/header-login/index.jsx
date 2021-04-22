import React from 'react';
import layout from './index.module.scss';
import Header from '../../../header/index';

class HeaderLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Header/>
        <div className={layout.banner}>
          <img src="/admin-logo-x2.png" alt=""/>
        </div>
      </>
    );
  }
}

export default HeaderLogin;
