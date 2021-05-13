import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import AuthorInfo from './components/author-info/index';
import CommentInput from './components/comment-input/index';
import LoadingTips from './components/loading-tips';
import { Icon, Toast, Popup } from '@discuzq/design';
import UserInfo from '@components/thread/user-info';
import Header from '@components/header';
import NoMore from './components/no-more';
import RewardPopup from './components/reward-popup';

import layout from './layout.module.scss';

import ReportPopup from './components/report-popup';
import ShowTop from './components/show-top';
import DeletePopup from '@components/thread-detail-pc/delete-popup';

import throttle from '@common/utils/thottle';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import Copyright from '@components/copyright';
import rewardPay from '@common/pay-bussiness/reward-pay';
import Recommend from '@components/recommend';
import QcCode from '@components/qcCode';

import RenderThreadContent from './content';
import RenderCommentList from './comment-list';
import goToLoginPage from '@common/utils/go-to-login-page';

@inject('site')
@inject('user')
@inject('thread')
@inject('comment')
@observer
class ThreadPCPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showReportPopup: false, // 是否弹出举报弹框
      showDeletePopup: false, // 是否弹出删除弹框
      showCommentInput: false, // 是否弹出评论框
      showMorePopup: false, // 是否弹出更多框
      showRewardPopup: false, // 打赏弹窗
      isCommentLoading: false, // 列表loading
      setTop: false, // 置顶
      inputValue: '', // 评论内容
    };

    this.perPage = 5;
    this.page = 1; // 页码
    this.commentDataSort = true;

    // 滚动定位相关属性
    this.threadBodyRef = React.createRef();
    this.commentDataRef = React.createRef();

    // 修改评论数据
    this.comment = null;

    // 举报内容选项
    this.reportContent = ['广告垃圾', '违规内容', '恶意灌水', '重复发帖'];
    this.inputText = '其他理由...';
  }

  // 滚动事件
  handleOnScroll() {
    // 加载评论列表
    const scrollDistance = this.threadBodyRef?.current?.scrollTop;
    const offsetHeight = this.threadBodyRef?.current?.offsetHeight;
    const scrollHeight = this.threadBodyRef?.current?.scrollHeight;
    const { isCommentReady, isNoMore } = this.props.thread;
    if (scrollDistance + offsetHeight >= scrollHeight && !this.state.isCommentLoading && isCommentReady && !isNoMore) {
      this.page = this.page + 1;
      this.loadCommentList();
    }
  }

  async onContentClick() {
    const thread = this.props.thread.threadData;
    // const res = await PayThread(thread);
  }

  // 加载评论列表
  async loadCommentList() {
    const { isCommentReady } = this.props.thread;
    if (this.state.isCommentLoading || !isCommentReady) {
      return;
    }

    this.setState({
      isCommentLoading: true,
    });
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      page: this.page,
      perPage: this.perPage,
      sort: this.commentDataSort ? 'createdAt' : '-createdAt',
    };

    const { success, msg } = await this.props.thread.loadCommentList(params);
    this.setState({
      isCommentLoading: false,
    });
    if (success) {
      return;
    }
    Toast.error({
      content: msg,
    });
  }

  // 列表排序
  onSortChange(isCreateAt) {
    this.commentDataSort = isCreateAt;
    this.page = 1;
    this.loadCommentList();
  }

  // 点击评论
  onInputClick() {
    this.setState({
      showCommentInput: true,
    });
  }

  // 更多操作
  onOperClick(type) {
    // 举报
    if (type === 'stick') {
      this.updateStick();
    }

    // 加精
    if (type === 'essence') {
      this.updateEssence();
    }

    // 删除
    if (type === 'delete') {
      this.setState({ showDeletePopup: true });
    }

    // 编辑
    if (type === 'edit') {
      if (!this.props.thread?.threadData?.id) return;
      this.props.router.push(`/thread/post?id=${this.props.thread?.threadData?.id}`);
    }

    // 举报
    if (type === 'report') {
      console.log('举报');
      this.setState({ showReportPopup: true });
    }
  }

  onReportClick(comment) {
    this.comment = comment;
    this.setState({ showReportPopup: true });
  }

  // 确定举报
  async onReportOk(val) {
    // 对没有登录的先登录
    if (!this.props.user.isLogin()) {
      Toast.info({ content: '请先登录!' });
      goToLoginPage({ url: '/user/login' });
      return;
    }

    if (!val) return;
    const params = {
      threadId: this.props.thread.threadData.threadId,
      reason: val,
      userId: this.props.user.userInfo.id,
    };
    // 举报评论
    if (this.comment) {
      params.type = 2;
      params.postId = this.comment.id;
    } else {
      params.type = 1;
    }

    const { success, msg } = await this.props.thread.createReports(params);

    if (success) {
      Toast.success({
        content: '操作成功',
      });

      this.setState({ showReportPopup: false });
      return true;
    }

    Toast.error({
      content: msg,
    });
  }

  onReportCancel() {
    this.comment = null;
    this.setState({ showReportPopup: false });
  }

  // 置顶提示
  setTopState(isStick) {
    this.setState({
      showContent: isStick,
      setTop: !this.state.setTop,
    });
    setTimeout(() => {
      this.setState({ setTop: !this.state.setTop });
    }, 2000);
  }

  // 置顶接口
  async updateStick() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isStick: !this.props.thread?.threadData?.isStick,
    };
    const { success, msg } = await this.props.thread.updateStick(params);

    if (success) {
      this.setTopState(true);
      return;
    }

    Toast.error({
      content: msg,
    });
  }

  // 加精接口
  async updateEssence() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isEssence: !this.props.thread?.threadData?.displayTag?.isEssence,
    };
    const { success, msg } = await this.props.thread.updateEssence(params);

    if (success) {
      Toast.success({
        content: '操作成功',
      });
      return;
    }

    Toast.error({
      content: msg,
    });
  }

  // 帖子删除接口
  async delete() {
    this.setState({ showDeletePopup: false });
    const id = this.props.thread?.threadData?.id;

    const { success, msg } = await this.props.thread.delete(id, this.props.index);

    if (success) {
      Toast.success({
        content: '删除成功，即将跳转至首页',
      });

      setTimeout(() => {
        this.props.router.push('/');
      }, 1000);

      return;
    }

    Toast.error({
      content: msg,
    });
  }

  onBtnClick() {
    this.delete();
    this.setState({ showDeletePopup: false });
  }

  // 点击发布按钮
  async onPublishClick(val) {
    if (!val) return;
    return this.comment ? await this.updateComment(val) : await this.createComment(val);
  }

  // 创建评论
  async createComment(val) {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      content: val,
      postId: this.props.thread?.threadData?.postId,
      sort: this.commentDataSort, // 目前的排序
      isNoMore: false,
      attachments: [],
    };

    const { success, msg } = await this.props.comment.createComment(params, this.props.thread);
    if (success) {
      Toast.success({
        content: '评论成功',
      });
      this.setState({
        showCommentInput: false,
        inputValue: '',
      });
      return true;
    }
    Toast.error({
      content: msg,
    });
  }

  // 更新评论
  async updateComment(val) {
    if (!this.comment) return;

    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      pid: this.comment.id,
      content: val,
      attachments: [],
    };
    const { success, msg } = await this.props.comment.updateComment(params, this.props.thread);
    if (success) {
      Toast.success({
        content: '修改成功',
      });
      this.setState({
        showCommentInput: false,
      });
      return true;
    }
    Toast.error({
      content: msg,
    });
  }

  // 点击编辑评论
  onEditClick(comment) {
    this.comment = comment;
    console.log(this.comment);
    this.setState({
      inputValue: comment.content,
      showCommentInput: true,
    });
  }

  // 弹出框关闭
  onClose() {
    this.setState({
      showCommentInput: false,
    });
    this.comment = null;
  }

  // 点赞
  async onLikeClick() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      pid: this.props.thread?.threadData?.postId,
      isLiked: !this.props.thread?.threadData?.isLike,
    };
    const { success, msg } = await this.props.thread.updateLiked(params, this.props.index, this.props.user);

    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 分享
  async onShareClick() {
    Toast.info({ content: '复制链接成功' });

    const { title = '' } = this.props.thread?.threadData || {};
    h5Share(title);

    const id = this.props.thread?.threadData?.id;

    const { success, msg } = await this.props.thread.shareThread(id);

    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 点击收藏icon
  async onCollectionClick() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isFavorite: !this.props.thread?.isFavorite,
    };
    const { success, msg } = await this.props.thread.updateFavorite(params);

    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 点击关注
  onFollowClick() {
    if (this.props.thread.threadData.userId) {
      this.props.thread?.authorInfo?.follow === 2 || this.props.thread?.authorInfo?.follow === 1
        ? this.props.thread.cancelFollow({ id: this.props.thread.threadData.userId, type: 1 }, this.props.user)
        : this.props.thread.postFollow(this.props.thread.threadData.userId, this.props.user);
    }
  }

  // 点击打赏
  onRewardClick() {
    this.setState({ showRewardPopup: true });
  }

  // 确认打赏
  async onRewardSubmit(value) {
    if (!isNaN(Number(value)) && this.props.thread?.threadData?.threadId && this.props.thread?.threadData?.userId) {
      this.setState({ showRewardPopup: false });
      const params = {
        amount: Number(value),
        threadId: this.props.thread.threadData.threadId,
        payeeId: this.props.thread.threadData.userId,
      };

      const { success } = await rewardPay(params);

      // 支付成功重新请求帖子数据
      if (success && this.props.thread?.threadData?.threadId) {
        this.props.thread.fetchThreadDetail(this.props.thread?.threadData?.threadId);
      }
    }
  }

  render() {
    const { thread: threadStore } = this.props;
    const { isReady, isCommentReady, isNoMore, totalCount } = threadStore;
    // 是否作者自己
    const isSelf = this.props.user?.userInfo?.id && this.props.user?.userInfo?.id === threadStore?.threadData?.userId;

    return (
      <div className={layout.container}>
        <ShowTop showContent={this.props.thread?.threadData?.isStick} setTop={this.state.setTop}></ShowTop>
        <div className={layout.header}>
          <Header></Header>
        </div>

        <div
          className={layout.body}
          ref={this.threadBodyRef}
          onScrollCapture={() => throttle(this.handleOnScroll(), 500)}
        >
          {/* 左边内容和评论 */}
          <div className={layout.bodyLeft}>
            {/* 帖子内容 */}
            {isReady ? (
              <RenderThreadContent
                store={threadStore}
                onOperClick={(type) => this.onOperClick(type)}
                onLikeClick={() => this.onLikeClick()}
                onCollectionClick={() => this.onCollectionClick()}
                onShareClick={() => this.onShareClick()}
                onContentClick={() => this.onContentClick()}
                onRewardClick={() => this.onRewardClick()}
              ></RenderThreadContent>
            ) : (
              <LoadingTips type="init"></LoadingTips>
            )}

            {/* 回复详情内容 */}
            <div className={`${layout.bottom}`} ref={this.commentDataRef}>
              {isCommentReady ? (
                <Fragment>
                  <RenderCommentList
                    router={this.props.router}
                    sort={(flag) => this.onSortChange(flag)}
                    onEditClick={(comment) => this.onEditClick(comment)}
                    onPublishClick={(value) => this.onPublishClick(value)}
                    onReportClick={(comment) => this.onReportClick(comment)}
                  ></RenderCommentList>
                  {this.state.isCommentLoading && <LoadingTips></LoadingTips>}
                </Fragment>
              ) : (
                <LoadingTips type="init"></LoadingTips>
              )}
            </div>
            {isNoMore && <NoMore empty={totalCount === 0}></NoMore>}
          </div>

          {/* 右边信息 */}
          <div className={layout.bodyRigth}>
            <div className={layout.authorInfo}>
              {threadStore?.authorInfo ? (
                <AuthorInfo
                  user={threadStore.authorInfo}
                  onFollowClick={() => this.onFollowClick()}
                  isShowBtn={!isSelf}
                ></AuthorInfo>
              ) : (
                <LoadingTips type="init"></LoadingTips>
              )}
            </div>
            <div className={layout.recommend}>
              <Recommend></Recommend>
            </div>
            <div className={layout.qrcode}>
              <QcCode></QcCode>
            </div>
            <div className={layout.copyright}>
              <Copyright></Copyright>
            </div>
          </div>
        </div>

        {/* 编辑弹窗 */}
        <Popup position="center" visible={this.state.showCommentInput} onClose={() => this.onClose()}>
          <div className={layout.editCmment}>
            <div className={layout.close} onClick={() => this.onClose()}>
              <Icon size={18} name="WrongOutlined"></Icon>
            </div>
            <div className={layout.title}>编辑评论</div>
            <div className={layout.user}>
              <UserInfo
                name={this?.comment?.user?.username || ''}
                avatar={this?.comment?.user?.avatar || ''}
                time={`${this?.comment?.updatedAt}` || ''}
                userId={this?.comment?.user?.userId}
                platform="pc"
              ></UserInfo>
            </div>
            <CommentInput
              height="middle"
              onSubmit={(value) => this.onPublishClick(value)}
              initValue={this.state.inputValue}
            ></CommentInput>
          </div>
        </Popup>

        {/* 删除弹层 */}
        <DeletePopup
          visible={this.state.showDeletePopup}
          onClose={() => this.setState({ showDeletePopup: false })}
          onBtnClick={() => this.delete()}
        ></DeletePopup>

        {/* 举报弹层 */}
        <ReportPopup
          reportContent={this.reportContent}
          inputText={this.inputText}
          visible={this.state.showReportPopup}
          onCancel={() => this.onReportCancel()}
          onOkClick={(data) => this.onReportOk(data)}
        ></ReportPopup>

        {/* 打赏弹窗 */}
        <RewardPopup
          visible={this.state.showRewardPopup}
          onCancel={() => this.setState({ showRewardPopup: false })}
          onOkClick={(value) => this.onRewardSubmit(value)}
        ></RewardPopup>
      </div>
    );
  }
}

export default withRouter(ThreadPCPage);
