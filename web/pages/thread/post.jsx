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
    const { fetchEmoji, fetchFollow, fetchProductAnalysis, fetchTopic } = this.props.threadPost;
    fetchEmoji();
    fetchFollow();
    fetchProductAnalysis({ address: 'https://item.jd.com/31932516081.html' });
    fetchTopic();
  }

  render() {
    const { topics  } = this.props.threadPost;
    console.log(topics);
    return (
      <>
        <DVditor />
      </>
    );
  }
}

export default ThreadCreate;
