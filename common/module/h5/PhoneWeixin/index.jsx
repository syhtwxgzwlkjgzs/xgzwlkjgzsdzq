import React from 'react';
import layout from './index.module.scss';
import { Popup, Button } from '@discuzq/design';
import '@discuzq/design/styles/index.scss';


class PhoneInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { visible, close, loginCallback } = this.props;
    return (
      <Popup
        position="bottom"
        visible={visible}
        onClose={close}
      >
        <div className={layout.container}>
          <div className={layout.log}>
            <img src="https://main.qcloudimg.com/raw/9d572dcf213ad279161059cd4429e824.png" alt=""/>
          </div>
          <Button className={layout.button} type="primary" onClick={loginCallback}>
            微信快捷登录
          </Button>
        </div>
      </Popup>
    );
  }
}

export default PhoneInput;
