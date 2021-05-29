import React from 'react';
import { getCurrentInstance } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import Page from '@components/page';
import { inject } from 'mobx-react';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import ThreadMiniPage from '@layout/thread/index';
import PayBoxProvider from '@components/payBox/payBoxProvider';
import ErrorMiniPage from '../../layout/error/index';

const MemoToastProvider = React.memo(ToastProvider);

@inject('site')
@inject('thread')
@inject('user')
class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isServerError: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.router?.query?.id && this.props.router.query.id !== prevProps.router.query.id) {
      this.props.thread.reset();
      this.getPageDate(this.props.router.query.id);
    }
  }

  async componentDidShow() {
    const { id } = getCurrentInstance().router.params;
    // 判断缓存
    // const oldId = this.props?.thread?.threadData?.threadId;
    // if (Number(id) === oldId && id && oldId) {
    //   return;
    // }
    // this.props.thread.reset();

    if (id) {
      this.getPageDate(id);
    }
  }

  async getPageDate(id) {
    if (!this.props?.thread?.threadData) {
      const res = await this.props.thread.fetchThreadDetail(id);

      if (res.code !== 0) {
        this.setState({
          isServerError: true,
        });
        return;
      }

      // 判断是否审核通过
      const isApproved = (this.props.thread?.threadData?.isApproved || 0) === 1;
      if (!isApproved) {
        const currentUserId = this.props.user?.userInfo?.id; // 当前登录用户
        const userId = this.props.thread?.threadData?.user?.userId; // 帖子作者
        // 不是作者自己。跳回首页
        if (!currentUserId || !userId || currentUserId !== userId) {
          Taro.redirectTo({
            url: `pages/index/index`,
          });
          return;
        }
      }
    }
    if (!this.props?.thread?.commentList) {
      const params = {
        id,
      };
      this.props.thread.loadCommentList(params);
    }
  }

  render() {
    return this.state.isServerError ? (
      <ErrorMiniPage />
    ) : (
      <Page>
        <MemoToastProvider>
          <PayBoxProvider>
            <ThreadMiniPage></ThreadMiniPage>
          </PayBoxProvider>
        </MemoToastProvider>
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Detail;
