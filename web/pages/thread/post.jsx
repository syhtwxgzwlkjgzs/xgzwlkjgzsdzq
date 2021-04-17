/**
 * 创建帖子页面
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import DVditor from '@components/editor';
// import Upload from '@components/upload';
import { AttachmentToolbar, DefaultToolbar } from '@components/editor/toolbar';
import Emoji from '@components/editor/emoji';

@inject('threadPost')
@observer
class ThreadCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiShow: false,
      emoji: {},
    };
  }
  componentDidMount() {
    const { fetchEmoji } = this.props.threadPost;
    fetchEmoji();
  }

  handleDefaultToolbarClick = (item) => {
    this.setState({
      emojiShow: item.id === 'emoji',
      emoji: {},
    });
  };

  handleEmojiClick = (emoji) => {
    this.setState({ emojiShow: false, emoji });
  };

  render() {
    const { threadPost } = this.props;
    const { emojiShow, emoji } = this.state;
    return (
      <>
        <DVditor emoji={emoji} />
        {/* 调整了一下结构，因为这里的工具栏需要固定 */}
        <AttachmentToolbar />
        {/* 默认的操作栏 */}
        <DefaultToolbar onClick={this.handleDefaultToolbarClick}>
          {/* 表情 */}
          <Emoji show={emojiShow} emojis={threadPost.emojis} onClick={this.handleEmojiClick} />
        </DefaultToolbar>
      </>
    );
  }
}

export default ThreadCreate;
