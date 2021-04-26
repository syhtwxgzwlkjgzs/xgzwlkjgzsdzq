import React, { Fragment, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import RecommendContent from './components/recommend-content/index';
import AuthorInfo from './components/author-info/index';
import CommentList from './components/comment-list/index';
import CommentInput from './components/input/index';
import LoadingTips from './components/loading-tips';
import { Icon, Toast, Tag, Button, Card, Menu } from '@discuzq/design';
import UserInfo from '@components/thread/user-info';
import Header from '@components/header';
import NoMore from './components/no-more';

import layout from './layout.module.scss';
import topic from './topic.module.scss';
import comment from './comment.module.scss';

import ShowTop from './components/show-top';
import DeletePopup from './components/delete-popup';
import ImageContent from '@components/thread/image-content';
import AudioPlay from '@components/thread/audio-play';
import PostContent from '@components/thread/post-content';
import ProductItem from '@components/thread/product-item';
import VideoPlay from '@components/thread/video-play';
import PostRewardProgressBar, { POST_TYPE } from '@components/thread/post-reward-progress-bar';
import Tip from '@components/thread/tip';
import AttachmentView from '@components/thread/attachment-view';
import throttle from '@common/utils/thottle';
import classnames from 'classnames';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';

const typeMap = {
  101: 'IMAGE',
  102: 'VOICE',
  103: 'VIDEO',
  104: 'GOODS',
  105: 'QA',
  106: 'RED_PACKET',
  107: 'REWARD',
  108: 'VOTE',
  109: 'QUEUE',
  110: 'FILE',
  111: 'QA_IMAGE',
};

// 帖子内容
const RenderThreadContent = observer((props) => {
  const { store: threadStore } = props;
  const { text, indexes } = threadStore?.threadData?.content || {};
  const tipData = {
    postId: threadStore?.threadData?.postId,
    threadId: threadStore?.threadData?.threadId,
  };
  // 是否合法
  const isApproved = threadStore?.threadData?.isApproved || 0;
  const isEssence = threadStore?.threadData?.displayTag?.isEssence || false;

  const parseContent = {};
  if (indexes && Object.keys(indexes)) {
    Object.entries(indexes).forEach(([, value]) => {
      if (value) {
        const { tomId, body } = value;
        parseContent[typeMap[tomId]] = body;
      }
    });
  }

  const onMoreClick = () => {
    props.fun.moreClick();
  };

  const onLikeClick = () => {
    typeof props.onLikeClick === 'function' && props.onLikeClick();
  };

  const onBuyClick = (url) => {
    url && window.open(url);
  };

  return (
    <div className={`${layout.top} ${topic.container}`}>
      <div className={topic.header}>
        <div className={topic.userInfo}>
          <UserInfo
            name={threadStore?.threadData?.user?.userName || ''}
            avatar={threadStore?.threadData?.user?.avatar || ''}
            location={threadStore?.threadData?.position.location || ''}
            view={`${threadStore?.threadData?.viewCount}` || ''}
            time={`${threadStore?.threadData?.createdAt}` || ''}
            isEssence={isEssence}
          ></UserInfo>
        </div>
        <div className={topic.more} onClick={onMoreClick}>
          <Icon size="20" color="#8590A6" name="MoreVOutlined"></Icon>
        </div>
      </div>

      {
        isApproved === 1
        && <div className={topic.body}>
          {/* 文字 */}
          {text && <PostContent content={text || ''} />}
          {/* 视频 */}
          {parseContent.VIDEO && (
            <VideoPlay
              url={parseContent.VIDEO.mediaUrl}
              coverUrl={parseContent.VIDEO.coverUrl}
              width={400}
              height={200}
            />
          )}
          {/* 图片 */}
          {parseContent.IMAGE && <ImageContent imgData={parseContent.IMAGE} />}
          {/* 商品 */}
          {parseContent.GOODS && (
            <div>
              <ProductItem
                image={parseContent.GOODS.imagePath}
                amount={parseContent.GOODS.price}
                title={parseContent.GOODS.title}
              />
              <Button
                className={topic.buyBtn}
                type="primary"
                onClick={() => onBuyClick(parseContent.GOODS.detailContent)}
              >
                购买商品
            </Button>
            </div>
          )}
          {/* 音频 */}
          {parseContent.VOICE && <AudioPlay url={parseContent.VOICE.mediaUrl} />}
          {/* 附件 */}
          {parseContent.VOTE && <AttachmentView attachments={parseContent.VOTE} />}

          <div className={topic.tag}>使用交流</div>

          {(parseContent.RED_PACKET || parseContent.REWARD) && (
            <div className={topic.reward}>
              {/* 红包 */}
              {parseContent.RED_PACKET && (
                <PostRewardProgressBar remaining={parseContent.RED_PACKET.number} received={1} />
              )}
              {/* 打赏 */}
              {parseContent.REWARD && <PostRewardProgressBar type={POST_TYPE.BOUNTY} remaining={2} received={5} />}
            </div>
          )}

          {/* <div style={{ textAlign: 'center' }}>
          <Button className={topic.rewardButton} type='primary' size='large'>打赏</Button>
        </div> */}
          {/* 附件 */}
        </div>
      }
      <div className={topic.footer}>
        <div className={topic.thumbs}>
          <div
            className={classnames(topic.liked, threadStore?.threadData?.isLike && topic.isLiked)}
            onClick={onLikeClick}
          >
            <Icon name="LikeOutlined"></Icon>
            <span>{threadStore?.threadData?.likeReward?.likePayCount || ''}</span>
          </div>
          <div className={topic.likeReward} >
            <Tip tipData={tipData} imgs={threadStore?.threadData?.likeReward?.users || []}></Tip>
          </div>
        </div>
        {
          threadStore?.threadData?.likeReward?.shareCount > 0
          && <span>{threadStore?.threadData?.likeReward?.shareCount}次分享</span>
        }
      </div>
    </div>
  );
});

// 评论列表
@inject('thread')
@inject('comment')
@observer
class RenderCommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentInput: false, // 是否弹出评论框
      commentSort: true, // ture 评论从旧到新 false 评论从新到旧
      showDeletePopup: false, // 是否弹出删除弹框
      inputText: '请输入内容', // 默认回复框placeholder内容
    };

    this.commentData = null;
    this.replyData = null;
  }

  // 评论列表排序
  onSortClick = () => {
    this.setState({
      commentSort: !this.state.commentSort,
    });
    typeof this.props.sort === 'function' && this.props.sort(!this.state.commentSort);
  }

  // 点击评论的赞
  async likeClick(data) {
    if (!data.id) return;

    const params = {
      id: data.id,
      isLiked: !data.isLiked,
    };
    const { success, msg } = await this.props.comment.updateLiked(params);

    if (success) {
      this.props.thread.setCommentListDetailField(data.id, 'isLiked', params.isLiked);
      const likeCount = params.isLiked ? data.likeCount + 1 : data.likeCount - 1;
      this.props.thread.setCommentListDetailField(data.id, 'likeCount', likeCount);
    }

    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 点击回复的赞
  async replyLikeClick(reply, comment) {
    if (!reply.id) return;

    const params = {
      id: reply.id,
      isLiked: !reply.isLiked,
    };
    const { success, msg } = await this.props.comment.updateLiked(params);

    if (success) {
      this.props.thread.setReplyListDetailField(comment.id, reply.id, 'isLiked', params.isLiked);
      const likeCount = params.isLiked ? reply.likeCount + 1 : reply.likeCount - 1;
      this.props.thread.setReplyListDetailField(comment.id, reply.id, 'likeCount', likeCount);
    }

    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 点击评论的删除
  async deleteClick(data) {
    this.commentData = data;
    this.setState({
      showDeletePopup: true,
    });
  }

  // 删除评论
  async deleteComment() {
    if (!this.commentData.id) return;

    const { success, msg } = await this.props.comment.delete(this.commentData.id, this.props.thread);
    this.setState({
      showDeletePopup: false,
    });
    if (success) {
      Toast.success({
        content: '删除成功',
      });
      return;
    }
    Toast.error({
      content: msg,
    });
  }

  // 点击评论的回复
  replyClick(comment) {
    this.commentData = comment;
    this.replyData = null;
    const userName = comment?.user?.username || comment?.user?.userName;
    this.setState({
      showCommentInput: true,
      inputText: userName ? `回复${userName}` : '请输入内容',
    });
  }

  // 点击回复的回复
  replyReplyClick(reply, comment) {
    this.commentData = null;
    this.replyData = reply;
    this.replyData.commentId = comment.id;
    const userName = reply?.user?.username || reply?.user?.userName;

    this.setState({
      showCommentInput: true,
      inputText: userName ? `回复${userName}` : '请输入内容',
    });
  }

  // 创建回复评论+回复回复接口
  async createReply(val) {
    const id = this.props.thread?.threadData?.id;
    if (!id) return;

    const params = {
      id,
      content: val,
    };

    // 楼中楼回复
    if (this.replyData) {
      params.replyId = this.replyData.id;
      params.isComment = true;
      params.commentId = this.replyData.commentId;
      params.commentPostId = this.replyData.id;
    }
    // 回复评论
    if (this.commentData) {
      params.replyId = this.commentData.id;
      params.isComment = true;
      params.commentId = this.commentData.id;
    }

    const { success, msg } = await this.props.comment.createReply(params, this.props.thread);

    if (success) {
      this.setState({
        showCommentInput: false,
        inputValue: '',
      });
      Toast.success({
        content: '回复成功',
      });
      return true;
    }

    Toast.error({
      content: msg,
    });
  }

  // 点击编辑
  editClick(comment) {
    typeof this.props.onEditClick === 'function' && this.props.onEditClick(comment);
  }

  onCommentClick(data) {
    if (data.id && this.props.thread?.threadData?.id) {
      this.props.router.push(`/thread/comment/${data.id}?threadId=${this.props.thread?.threadData?.id}`);
    }
  }

  render() {
    const { totalCount, commentList } = this.props.thread;
    return (
      <Fragment>
        <div className={comment.header}>
          <div className={comment.number}>共{totalCount}条评论</div>
          <div className={comment.sort} onClick={() => this.onSortClick()}>
            <Icon className={comment.sortIcon} name="SortOutlined"></Icon>
            <span className={comment.sortText}>
              {this.state.commentSort ? '评论从旧到新' : '评论从新到旧'}
            </span>
          </div>
        </div>

        {/* 输入框 */}
        <div className={comment.input}>
          <CommentInput onSubmit={value => this.onPublishClick(value)} height='middle'></CommentInput>
        </div>

        <div className={comment.body}>
          {commentList.map((val, index) => (
            <div className={comment.commentItems} key={val.id || index}>
              <CommentList
                data={val}
                key={val.id}
                likeClick={() => this.likeClick(val)}
                replyClick={() => this.replyClick(val)}
                deleteClick={() => this.deleteClick(val)}
                editClick={() => this.editClick(val)}
                replyLikeClick={reploy => this.replyLikeClick(reploy, val)}
                replyReplyClick={reploy => this.replyReplyClick(reploy, val)}
                onCommentClick={() => this.onCommentClick(val)}
                isShowOne={true}
              ></CommentList>
            </div>
          ))}
        </div>
        <DeletePopup
          visible={this.state.showDeletePopup}
          onClose={() => this.setState({ showDeletePopup: false })}
          onBtnClick={() => this.deleteComment()}
        ></DeletePopup>
      </Fragment>
    );
  }
}

@inject('site')
@inject('user')
@inject('thread')
@inject('comment')
@observer
class ThreadPCPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeletePopup: false, // 是否弹出删除弹框
      showCommentInput: false, // 是否弹出评论框
      showMorePopup: false, // 是否弹出更多框
      isCommentLoading: false, // 列表loading
      setTop: false, // 置顶
      showContent: '',
      // inputValue: '', // 评论内容
    };

    this.perPage = 5;
    this.page = 1; // 页码
    this.commentDataSort = false;

    // 滚动定位相关属性
    this.threadBodyRef = React.createRef();
    this.commentDataRef = React.createRef();
    this.position = 0;
    this.nextPosition = 0;
    this.flag = true;

    // 修改评论数据
    this.comment = null;
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

    if (this.flag) {
      this.nextPosition = this.threadBodyRef?.current?.scrollTop || 0;
    }
  }

  componentDidMount() {
    // 当内容加载完成后，获取评论区所在的位置
    this.position = this.commentDataRef?.current?.offsetTop - 50;
  }

  componentDidUpdate() {
    // 当内容加载完成后，获取评论区所在的位置
    if (this.props.thread.isReady) {
      this.position = this.commentDataRef?.current?.offsetTop - 50;
    }
  }

  componentWillUnmount() {
    // 清空数据
    // this.props?.thread && this.props.thread.reset();
  }

  // 点击信息icon
  onMessageClick() {
    const position = this.flag ? this.position : this.nextPosition;
    this.flag = !this.flag;
    this.threadBodyRef.current.scrollTo(0, position);
  }

  // 点击收藏icon
  async onCollectionClick() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isFavorite: !this.props.thread?.isFavorite,
    };
    const { success, msg } = await this.props.thread.updateFavorite(params);

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
      sort: this.commentDataSort ? '-createdAt' : 'createdAt',
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

  // 点击更多icon
  onMoreClick = () => {
    console.log('更多');
    // this.setState({
    //   text: !this.state.text,
    // });
    this.setState({ showMorePopup: true });
  };

  onOperClick = (type) => {
    // 1 置顶  2 加精  3 删除  4 举报
    this.setState({ showMorePopup: false });

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
  };

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
  onPublishClick(val) {
    this.comment ? this.updateComment(val) : this.createComment(val);
  }

  // 创建评论
  async createComment(val) {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      content: val,
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
        inputValue: '',
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
    const { success, msg } = await this.props.thread.updateLiked(params, this.props.index);

    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 分享
  async onShareClick() {
    Toast.info({ content: '分享链接已复制成功' });

    const { title = '' } = this.props.thread?.threadData || {};
    h5Share(title);

    // const id = this.props.thread?.threadData?.id;

    // const { success, msg } = await this.props.thread.shareThread(id);

    // if (!success) {
    //   Toast.error({
    //     content: msg,
    //   });
    // }
  }

  render() {
    const { thread: threadStore } = this.props;
    const { isReady, isCommentReady, isNoMore, totalCount } = threadStore;
    const fun = {
      moreClick: this.onMoreClick,
    };

    // 更多弹窗权限
    const morePermissions = {
      canEdit: threadStore?.threadData?.ability?.canEdit,
      canDelete: threadStore?.threadData?.ability?.canDelete,
      canEssence: threadStore?.threadData?.ability?.canEssence,
      canStick: threadStore?.threadData?.ability?.canStick,
    };
    // 更多弹窗界面
    const moreStatuses = {
      isEssence: threadStore?.threadData?.displayTag?.isEssence,
      isStick: threadStore?.threadData?.isStick,
    };

    const isApproved = threadStore?.threadData?.isApproved || 0;

    return (
      <div className={layout.container}>
        <ShowTop showContent={this.state.showContent} setTop={this.state.setTop}></ShowTop>
        <div className={layout.header}>
          <Header></Header>
        </div>

        <div
          className={layout.body}
          ref={this.threadBodyRef}
          onScrollCapture={() => throttle(this.handleOnScroll(), 500)}
        >
          <div className={layout.body}>
            {/* 左边内容和评论 */}
            <div className={layout.bodyLeft}>
              <div className={topic.container}>
                {/* 帖子内容 */}
                {isReady ? (
                  <RenderThreadContent
                    store={threadStore}
                    fun={fun}
                    onLikeClick={() => this.onLikeClick()}
                  ></RenderThreadContent>
                ) : (
                  <LoadingTips type="init"></LoadingTips>
                )}
              </div>

              {/* 回复详情内容 */}
              <div className={`${layout.bottom} ${comment.container}`} ref={this.commentDataRef}>
                {isCommentReady ? (
                  <Fragment>
                    <RenderCommentList
                      router={this.props.router}
                      sort={flag => this.onSortChange(flag)}
                      onEditClick={comment => this.onEditClick(comment)}>
                    </RenderCommentList>
                    {this.state.isCommentLoading && <LoadingTips></LoadingTips>}
                    {isNoMore && <NoMore empty={totalCount === 0}></NoMore>}
                  </Fragment>
                ) : (
                  <LoadingTips type="init"></LoadingTips>
                )}
              </div>
            </div>

            {/* 右边信息 */}
            <div className={layout.bodyRigth}>
              <div className={layout.authorInfo}>
                <AuthorInfo></AuthorInfo>
              </div>
              <div className={layout.recommend}>
                <RecommendContent></RecommendContent>
              </div>
            </div>
          </div>
          <DeletePopup
            visible={this.state.showDeletePopup}
            onClose={() => this.setState({ showDeletePopup: false })}
            onBtnClick={() => this.delete()}
          ></DeletePopup>
        </div>
      </div>
    );
  }
}

export default withRouter(ThreadPCPage);
