// import React from 'react';
// import styles from './index.module.scss';
// import { inject, observer } from 'mobx-react';
// import { Button } from '@discuzq/design';
// import { View } from '@tarojs/components';

// const Index = inject('site')(
//   observer(() => {
//     const test = () => {};

//     return (
//       <View className={styles.container}>
//         <Button onClick={test}>mini test</Button>
//       </View>
//     );
//   }),
// );

// export default Index;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '../../components/message/instant-messaging';

@inject('site')
@observer
class MessagePage extends Component {
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

export default MessagePage;
