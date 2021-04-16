/**
 * 创建帖子页面
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import DVditor from '@components/editor';

@inject('threadPost')
@observer
class ThreadCreate extends React.Component {
  componentDidMount() {
    const { fetchEmoji } = this.props.threadPost;
    fetchEmoji();
  }

  render() {
    const { threadPost  } = this.props;
    return (
      <>
        <DVditor emojis={threadPost.emojis} />
      </>
    );
  }
}

export default ThreadCreate;
