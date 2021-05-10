import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '../instant-messaging';

@inject('site')
@observer
class MsgH5Page extends Component {
  state = {
    messagesHistory: [],
  };

  doSubmit = (val) => {
    if (!val) return;
    const { messagesHistory } = this.state;
    this.setState({ messagesHistory: [...messagesHistory, val] });
    return true;
  };

  render() {
    const { messagesHistory } = this.state;
    return <InstantMessaging messagesHistory={messagesHistory} onSubmit={this.doSubmit} persona={'myself'} />;
  }
}

export default MsgH5Page;
