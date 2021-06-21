import React from 'react';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import DialogBox from './dialog-box';
import InteractionBox from './interaction-box';

import styles from './index.module.scss';

@inject('site')
@inject('message')
@observer
class InstantMessaging extends React.Component {
  state = {
    showEmoji: false,
    dialogId: '',
    keyboardHeight: 0,
    inputBottom: 15, // 键盘弹起时输入框有一个向下的偏移量，要适配，单位px
  };

  componentDidMount() {
    this.updateDialogId(this.props.dialogId);

    // 监听键盘高度变化
    Taro.onKeyboardHeightChange(res => {
      this.setState({
        keyboardHeight: res?.height || 0,
      });
    });
  }

  componentWillUnmount() {
    this.props.message.clearMessage();
  }

  updateDialogId(dialogId) {
    this.setState({
      dialogId
    });
  }

  render() {
    const { username } = this.props;
    const { showEmoji, dialogId, keyboardHeight, inputBottom } = this.state;

    return (
      <View className={styles.container}>
        <DialogBox
          dialogId={dialogId}
          showEmoji={showEmoji}
          hideEmoji={() => {
            this.setState({
              showEmoji: false,
            });
          }}
          keyboardHeight={keyboardHeight}
          inputBottom={inputBottom}
        />
        <InteractionBox
          username={username}
          keyboardHeight={keyboardHeight}
          inputBottom={inputBottom}
          showEmoji={showEmoji}
          dialogId={dialogId}
          // showEmoji={showEmoji}
          setShowEmoji={(show) => {
            this.setState({
              showEmoji: show,
            });
          }}
          updateDialogId={(dialogId) => {
            this.updateDialogId(dialogId);
          }}
        />
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
