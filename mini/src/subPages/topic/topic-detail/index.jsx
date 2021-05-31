import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPage from '@layout/topic/topic-detail';
import { readTopicsList } from '@server';
// import Toast from '@discuzq/design/dist/components/toast/index';
import { getCurrentInstance } from '@tarojs/taro';
import Page from '@components/page';
import withShare from '@common/utils/withShare'
@inject('topic')
@observer
@withShare({
  comeFrom:'topic-detail'
})
class Index extends React.Component {
  page = 1;
  perPage = 10;

  async componentDidMount() {
    const { topic } = this.props;
    const { id = '' } = getCurrentInstance().router.params;
    // if (!hasTopics) {
    //   this.toastInstance = Toast.loading({
    //     content: '加载中...',
    //     duration: 0,
    //   });

      this.page = 1;
      await topic.getTopicsDetail({ topicId: id });

      // this.toastInstance?.destroy();
    // }
  }
  render() {
    return <Page><IndexPage dispatch={this.dispatch} /></Page>;
  }
}

// eslint-disable-next-line new-cap
export default Index;