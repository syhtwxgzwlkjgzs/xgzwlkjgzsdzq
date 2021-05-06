import React from 'react';
import { getCurrentInstance } from '@tarojs/taro';
import Page from '@components/page';
import { inject } from 'mobx-react';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import ThreadMiniPage from '../../layout/thread/index';
import PayBoxProvider from '@components/payBox/payBoxProvider';

const MemoToastProvider = React.memo(ToastProvider)

@inject('site')
@inject('thread')
class Detail extends React.Component {

  async componentDidMount() {

    const { id } = getCurrentInstance().router.params;
    // 判断缓存
    const oldId = this.props?.thread?.threadData?.threadId;
    if (Number(id) === oldId && id && oldId) {
      return;
    }
    this.props.thread.reset();

    if (id && !this.props?.thread?.threadData?.threadId) {
      if (!this.props?.thread?.threadData) {
        this.props.thread.fetchThreadDetail(id);
      }
      if (!this.props?.thread?.commentList) {
        const params = {
          id,
        };
        this.props.thread.loadCommentList(params);
      }
    }
  }

  render() {
    return (
      <Page>
        <MemoToastProvider>
          <PayBoxProvider>
            <ThreadMiniPage></ThreadMiniPage>
          </PayBoxProvider>
        </MemoToastProvider>
      </Page>
    )
  }
}

// eslint-disable-next-line new-cap
export default Detail;
