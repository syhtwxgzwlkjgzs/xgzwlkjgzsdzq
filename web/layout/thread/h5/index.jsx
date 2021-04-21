import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import createThreadService from '@common/service/thread';
import createCommentService from '@common/service/comment';
import layout from './layout.module.scss';
import comment from './comment.module.scss';
import footer from './footer.module.scss';
import topic from './topic.module.scss';
import CommentList from './components/comment-list/index';
import NoMore from './components/no-more';
import LoadingTips from './components/loading-tips';

import { Icon, Input, Badge, Toast, Tag, Button } from '@discuzq/design';
import UserInfo from '@components/thread/user-info';
import Header from '@components/header';

import ShowTop from './components/show-top';
import DeletePopup from './components/delete-popup';
import MorePopup from './components/more-popup';
import InputPopup from './components/input-popup';
import ImageContent from '@components/thread/image-content';
import AudioPlay from '@components/thread/audio-play';
import PostContent from '@components/thread/post-content';
import ProductItem from '@components/thread/product-item';
import VideoPlay from '@components/thread/video-play';
import PostRewardProgressBar, { POST_TYPE } from '@components/thread/post-reward-progress-bar';
import Tip from '@components/thread/tip';
import AttachmentView from '@components/thread/attachment-view';

import classnames from 'classnames';

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
function RenderThreadContent(props) {
  const { store: threadStore } = props;
  const { text, indexes } = threadStore?.threadData?.content || {};

  const parseContent = {};
  if (indexes && Object.keys(indexes)) {
    Object.entries(indexes).forEach(([, value]) => {
      if (value) {
        const { tomId, body } = value;
        parseContent[typeMap[tomId]] = body;
      }
    });
  }
  console.log(parseContent);

  const onMoreClick = () => {
    props.fun.moreClick();
  };

  const onLikeClick = () => {
    typeof props.onLikeClick === 'function' && props.onLikeClick();
  };

  return (
    <div className={`${layout.top} ${topic.container}`}>
      <div className={topic.header}>
        <UserInfo
          name={threadStore?.threadData?.user?.userName || ''}
          avatar={threadStore?.threadData?.user?.avatar || ''}
          location={threadStore?.threadData?.position.location || ''}
          view={`${threadStore?.threadData?.viewCount}` || ''}
          time='3分钟前'>
        </UserInfo>
        <div>
          {threadStore?.threadData?.isEssence && <Tag type='primary'>精华</Tag>}
          <Icon
            size='20'
            name='ShareAltOutlined'
            onClick={onMoreClick}>
          </Icon>
        </div>
      </div>
      <div className={topic.body}>
        {/* 文字 */}
        {text && <PostContent content={text || ''} />}
        {/* 视频 */}
        {
          parseContent.VIDEO
          && <VideoPlay
            url={parseContent.VIDEO.mediaUrl}
            coverUrl={parseContent.VIDEO.coverUrl}
            width={400}
            height={200} />
        }
        {/* 图片 */}
        {parseContent.IMAGE && <ImageContent imgData={parseContent.IMAGE} />}
        {/* 商品 */}
        {
          parseContent.GOODS
          && <div>
            <ProductItem
              image={parseContent.GOODS.imagePath}
              amount={parseContent.GOODS.price}
              title={parseContent.GOODS.title}
            />
            <Button className={topic.buyBtn} type='primary'>购买商品</Button>
          </div>
        }
        {/* 音频 */}
        {parseContent.VOICE && <AudioPlay />}
        {/* 附件 */}
        {parseContent.VOTE && <AttachmentView attachments={parseContent.VOTE} />}

        <div className={topic.tag}>使用交流</div>

        {(parseContent.RED_PACKET || parseContent.REWARD)
          && <div className={topic.reward}>
            {/* 红包 */}
            {parseContent.RED_PACKET && <PostRewardProgressBar remaining={parseContent.RED_PACKET.number} received={1} />}
            {/* 打赏 */}
            {parseContent.REWARD && <PostRewardProgressBar type={POST_TYPE.BOUNTY} remaining={2} received={5} />}
          </div>}

        {/* <div style={{ textAlign: 'center' }}>
          <Button className={topic.rewardButton} type='primary' size='large'>打赏</Button>
        </div> */}
        {/* 附件 */}
      </div>
      <div className={topic.footer}>
        <div className={topic.thumbs}>
          <div
            className={classnames(topic.liked, threadStore?.threadData?.isLiked && topic.isLiked)}
            onClick={onLikeClick}>
            <Icon name='LikeOutlined'></Icon>
            <span>1660万</span>
          </div>
          <Tip style={topic.likeReward} imgs={threadStore?.threadData?.likeReward?.users || []}></Tip>
        </div>
        <span>
          {threadStore?.threadData?.likeReward?.shareCount || 0}次分享
        </span>
      </div>
    </div>
  );
}

// 评论列表
@observer
class RenderCommentList extends React.Component {
  constructor(props) {
    super(props);
    this.service = this.props.service,
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
    const { success, msg } = await this.props.service.comment.updateLiked(params);
    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 点击回复的赞
  async replyLikeClick(reply) {
    if (!reply.id) return;

    const params = {
      id: reply.id,
      isLiked: !reply.isLiked,
    };
    const { success, msg } = await this.props.service.comment.updateLiked(params);
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

    const { success, msg } = await this.props.service.comment.delete(this.commentData.id);
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
    this.setState({
      showCommentInput: true,
      inputText: comment?.user?.username ? `回复${comment.user.username}` : '请输入内容',
    });
  }

  // 点击回复的回复
  replyReplyClick(reply, comment) {
    this.commentData = null;
    this.replyData = reply;
    this.replyData.commentId = comment.id;
    console.log(reply);
    this.setState({
      showCommentInput: true,
      inputText: reply?.user?.username ? `回复${reply.user.username}` : '请输入内容',
    });
  }

  // 创建回复评论+回复回复接口
  async createReply(val) {
    const id = this.props.store?.threadData?.id;
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

    console.log('参数', params);
    const { success, msg } = await this.service.comment.createReply(params);

    if (success) {
      this.setState({
        showCommentInput: false,
        inputText: '请输入内容',
      });
      Toast.success({
        content: '回复成功',
      });
      return;
    }

    Toast.error({
      content: msg,
    });
  }

  onCommentClick(data) {
    if (data.id && this.props.store?.threadData?.id) {
      this.props.router.push(`/thread/comment/${data.id}?threadId=${this.props.store?.threadData?.id}`);
    }
  }

  render() {
    const { totalCount, commentList } = this.props.store;
    return (
      <Fragment>
        <div className={comment.header}>
          <div className={comment.number}>
            共{totalCount}条评论
          </div>
          <div className={comment.sort} onClick={() => this.onSortClick()}>
            <Icon
              size='16'
              name='SortOutlined'>
            </Icon>
            <span className={comment.sortText}></span>
            {
              this.state.commentSort ? '评论从旧到新' : '评论从新到旧'
            }
          </div>
        </div>
        <div className={comment.body}>
          {
            commentList
              .map((val, index) => (
                <div className={comment.commentItems} key={val.id || index}>
                  <CommentList
                    data={val}
                    key={val.id}
                    likeClick={() => this.likeClick(val)}
                    replyClick={() => this.replyClick(val)}
                    deleteClick={() => this.deleteClick(val)}
                    replyLikeClick={reploy => this.replyLikeClick(reploy, val)}
                    replyReplyClick={reploy => this.replyReplyClick(reploy, val)}
                    onCommentClick={() => this.onCommentClick(val)}
                    isShowOne={true}>
                  </CommentList>
                </div>
              ))
          }
        </div>

        {/* 评论弹层 */}
        <InputPopup
          visible={this.state.showCommentInput}
          inputText={this.state.inputText}
          onClose={() => this.setState({ showCommentInput: false })}
          onSubmit={value => this.createReply(value)}>
        </InputPopup>

        {/* 删除弹层 */}
        <DeletePopup
          visible={this.state.showDeletePopup}
          onClose={() => this.setState({ showDeletePopup: false })}
          onBtnClick={() => this.deleteComment()}>
        </DeletePopup>
      </Fragment>
    );
  }
}

@inject('site')
@inject('user')
@inject('thread')
@inject('comment')
@observer
class ThreadH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.service = {
      thread: createThreadService(props),
      comment: createCommentService(props),
    };
    this.state = {
      showDeletePopup: false, // 是否弹出删除弹框
      showCommentInput: false, // 是否弹出评论框
      showMorePopup: false, // 是否弹出更多框
      isCommentLoading: false, // 列表loading
      setTop: false, // 置顶
      showContent: '',
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
  }

  // 滚动事件  TODO:增加节流处理
  handleOnScroll() {
    // 加载评论列表
    const scrollDistance = this.threadBodyRef?.current?.scrollTop;
    const offsetHeight = this.threadBodyRef?.current.offsetHeight;
    const scrollHeight = this.threadBodyRef?.current.scrollHeight;
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
    console.log(this.props);
  }

  componentDidUpdate() {
    // 当内容加载完成后，获取评论区所在的位置
    if (this.props.thread.isReady) {
      this.position = this.commentDataRef?.current?.offsetTop - 50;
    }
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
    const { success, msg } = await this.service.thread.updateFavorite(params);

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

    const { success, msg } = await this.service.thread.loadCommentList(params);
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
  }

  onOperClick = (type) => {
    // 1 置顶  2 加精  3 删除  4 举报
    this.setState({ showMorePopup: false });
    if (type === '1') {
      this.updateSticky();
    } else if (type === '2') {
      this.updateEssence();
    } else if (type === '3') {
      this.setState({ showDeletePopup: true });
    } else {
      console.log('举报');
    }
  }
  // 置顶提示
  setTopState(isSticky) {
    this.setState({
      showContent: isSticky,
      setTop: !this.state.setTop,
    });
    setTimeout(() => {
      this.setState({ setTop: !this.state.setTop });
    }, 2000);
  }
  // 置顶接口
  async updateSticky() {
    this.setTopState(false);
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isSticky: !this.props.thread?.isSticky,
    };
    const { success, msg } = await this.service.thread.updateSticky(params);

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

  // 加精接口
  async updateEssence() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isEssence: !this.props.thread?.isEssence,
    };
    const { success, msg } = await this.service.thread.updateEssence(params);

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
    const params = {
      id,
    };
    const { success, msg } = await this.service.thread.updateEssence(params);

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

  onBtnClick() {
    this.delete();
    this.setState({ showDeletePopup: false });
  }

  // 创建评论
  async onPublishClick(val) {
    console.log(val);
    this.setState({ showCommentInput: false });
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      content: val,
      sort: this.commentDataSort, // 目前的排序
      isNoMore: false,
      attachments: [],
    };
    const { success, msg } = await this.service.comment.createComment(params);
    if (success) {
      Toast.success({
        content: '评论成功',
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

  // 点赞
  async onLikeClick() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isLiked: !this.props.thread?.isLiked,
    };
    const { success, msg } = await this.service.thread.updateLiked(params);

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

  render() {
    const { thread: threadStore } = this.props;
    const { isReady, isCommentReady, isNoMore, totalCount } = threadStore;
    const fun = {
      moreClick: this.onMoreClick,
    };

    return (
      <div className={layout.container}>
        <div className={layout.header}>
          <Header></Header>
        </div>

        <div className={layout.body} ref={this.threadBodyRef} onScrollCapture={() => this.handleOnScroll()}>
          <ShowTop
            showContent={this.state.showContent}
            setTop={this.state.setTop}>
          </ShowTop>
          {/* 帖子内容 */}
          {
            isReady
              ? <RenderThreadContent
                store={threadStore}
                fun={fun}
                onLikeClick={() => this.onLikeClick()}>
              </RenderThreadContent>
              : <LoadingTips type='init'></LoadingTips>
          }

          {/* 评论列表 */}
          <div className={`${layout.bottom} ${comment.container}`} ref={this.commentDataRef}>
            {
              isCommentReady
                ? (
                  <Fragment>
                    <RenderCommentList
                      router={this.props.router}
                      store={threadStore}
                      service={this.service}
                      sort={flag => this.onSortChange(flag)}>
                    </RenderCommentList>
                    {this.state.isCommentLoading && <LoadingTips></LoadingTips>}
                    {isNoMore && <NoMore empty={totalCount === 0}></NoMore>}
                  </Fragment>
                )
                : <LoadingTips type='init'></LoadingTips>
            }
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className={layout.footer}>
          {/* 评论区触发 */}
          <div className={footer.inputClick} onClick={() => this.onInputClick()}>
            <Input
              className={footer.input}
              placeholder="写评论"
              disabled={true}>
            </Input>
          </div>

          {/* 评论弹层 */}
          <InputPopup
            visible={this.state.showCommentInput}
            onClose={() => this.setState({ showCommentInput: false })}
            onSubmit={value => this.onPublishClick(value)}>
          </InputPopup>
          {/* 更多弹层 */}
          <MorePopup
            visible={this.state.showMorePopup}
            onClose={() => this.setState({ showMorePopup: false })}
            onSubmit={() => this.setState({ showMorePopup: false })}
            onOperClick={type => this.onOperClick(type)}>
          </MorePopup>
          {/* 删除弹层 */}
          <DeletePopup
            visible={this.state.showDeletePopup}
            onClose={() => this.setState({ showDeletePopup: false })}
            onBtnClick={type => this.onBtnClick(type)}>
          </DeletePopup>
          {/* 操作区 */}
          <div className={footer.operate}>
            <div className={footer.icon} onClick={() => this.onMessageClick()}>
              <Badge info={totalCount > 99 ? '99+' : `${totalCount || '0'}`}>
                <Icon
                  size='20'
                  name='MessageOutlined'>
                </Icon>
              </Badge>
            </div>
            <Icon
              color={this.props.thread?.isFavorite ? 'blue' : ''}
              className={footer.icon}
              onClick={() => this.onCollectionClick()}
              size='20'
              name='HeartOutlined'>
            </Icon>
            <Icon
              className={footer.icon}
              size='20'
              name='ShareAltOutlined'>
            </Icon>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ThreadH5Page);
