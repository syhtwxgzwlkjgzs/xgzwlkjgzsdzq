import React from 'react';
import layout from './index.module.scss';

class HeaderLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={layout.banner}>
        <img src="https://main.qcloudimg.com/raw/ba94091fa7557eb8bed849ce577ea160.png" alt=""/>
      </div>
    );
  }
}

export default HeaderLogin;
