import React from 'react';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import DialogBox from './dialog-box';
import InteractionBox from './interaction-box';

import styles from './index.module.scss';

@inject('site')
@observer
class InstantMessaging extends React.Component {
  state = {
    dialogBoxRef: React.createRef(),
  };

  render() {
    const { messagesHistory = [], onSubmit, site } = this.props;
    const { dialogBoxRef } = this.state;
    const { platform } = site;

    return (
      <View className={styles.container}>
        <DialogBox shownMessages={messagesHistory} dialogBoxRef={dialogBoxRef} platform={platform} />
        <InteractionBox onSubmit={onSubmit} dialogBoxRef={dialogBoxRef} platform={platform} />
      </View>
    );
  }
}

InstantMessaging.propTypes = {
  messagesHistory: PropTypes.array.isRequired, // 消息历史输出组
  onSubmit: PropTypes.func.isRequired, // 作用于交互框中提交函数
  persona: PropTypes.string.isRequired, // 使用“myself”或者“itself”指定不同人称
};

// 设置props默认类型
InstantMessaging.defaultProps = {
  messagesHistory: [
    {
      timestamp: new Date().getTime(), // 消息发生时时间戳
      displayTimePanel: true, // 会话框中显示当前时间
      textType: 'string', // 消息内容类型
      text: '', // 消息内容
      ownedBy: 'myself', // 消息所属人
    },
  ],
  onSubmit: (val) => {
    console.log(`${val.text} has been submitted!`);
  },
};

export default InstantMessaging;
