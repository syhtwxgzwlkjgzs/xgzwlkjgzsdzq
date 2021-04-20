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

  return (
    <div className={`${layout.top} ${topic.container}`}>
      <div className={topic.header}>
        <UserInfo
          name={threadStore?.threadData?.user?.userName || ''}
          avatar={threadStore?.threadData?.user?.avatar || ''}
          location='腾讯大厦'
          view={threadStore?.threadData?.viewCount || ''}
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
            <Button style={{ width: '100%' }} type='primary'>购买商品</Button>
          </div>
        }
        {/* 音频 */}
        {parseContent.VOICE && <AudioPlay />}
        {/* 附件 */}
        {parseContent.VOTE && <AttachmentView attachments={parseContent.VOTE} />}

        <Tag>使用交流</Tag>

        {(parseContent.RED_PACKET || parseContent.REWARD)
          && <div className={topic.reward}>
            {/* 红包 */}
            {parseContent.RED_PACKET && <PostRewardProgressBar remaining={parseContent.RED_PACKET.number} received={1} />}
            {/* 打赏 */}
            {parseContent.REWARD && <PostRewardProgressBar type={POST_TYPE.BOUNTY} remaining={2} received={5} />}
          </div>}

        <div style={{ textAlign: 'center' }}>
          <Button className={topic.rewardButton} type='primary' size='large'>打赏</Button>
        </div>
        {/* 附件 */}
      </div>
      <div className={topic.footer}>
        <div className={topic.thumbs}>
          <Icon name='LikeOutlined'></Icon>
          1660万
          <Tip imgs={threadStore?.threadData?.likeReward?.users || []}></Tip>
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
    };

    this.comment = null;
  }

  // 评论列表排序
  onSortClick = () => {
    this.setState({
      commentSort: !this.state.commentSort,
    });
    typeof this.props.sort === 'function' && this.props.sort(!this.state.commentSort);
  }
  // 头像点击
  avatarClick(type) {
    if (type === '1') {
      Toast.success({
        content: '帖子评论的头像',
      });
    } else if (type === '2') {
      Toast.success({
        content: '评论回复头像',
      });
    } else {
      Toast.success({
        content: '评论回复对象的头像',
      });
    }
  }
  // 点赞
  async likeClick(type, data) {
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
      this.getCommentDetail();
      return;
    }

    Toast.error({
      content: msg,
    });
  }
  // 删除
  async deleteClick(type, data) {
    this.comment = data;
    this.setState({
      showDeletePopup: true,
    });
  }

  // 删除
  async deleteComment() {
    if (!this.comment.id) return;

    const { success, msg } = await this.props.service.comment.delete(this.comment.id);
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
  // 创建回复评论+回复回复接口
  async createReply(val) {
    this.setState({ showCommentInput: false });
    const id = this.props.store.thread?.threadData?.id;
    const params = {
      id, // 帖子id
      content: val, // 评论内容
      commentId: 0, // 评论id
      replyId: 0, // 回复id
      isComment: false, // 是否楼中楼
      commentPostId: [], // 评论回复ID
      commentUserId: [], // 评论回复用户ID
      attachments: [], // 附件内容
    };
    const { success, msg } = await this.service.comment.createReply(params);

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
    const { totalCount, commentList } = this.props.store;
    return (
      <Fragment>
        <div className={comment.header}>
          <div className={comment.number}>
            共{totalCount}条评论
          </div>
          <div className={comment.sort} onClick={() => this.onSortClick()}>
            <Icon
              size='14'
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
                <div className={comment.commentItems} key={index}>
                  <CommentList
                    data={val}
                    key={val.id}
                    avatarClick={type => this.avatarClick.bind(this, type)}
                    likeClick={type => this.likeClick.bind(this, type, val)}
                    replyClick={type => this.replyClick.bind(this, type)}
                    deleteClick={type => this.deleteClick.bind(this, type, val)}
                    isShowOne={true}>
                  </CommentList>
                </div>
              ))
          }
        </div>

        {/* 评论弹层 */}
        <InputPopup
          visible={this.state.showCommentInput}
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
    this.commentSort = false;

    // 滚动定位相关属性
    this.threadBodyRef = React.createRef();
    this.commentRef = React.createRef();
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
    this.position = this.commentRef?.current?.offsetTop - 50;
    console.log(this.props);
  }

  componentDidUpdate() {
    // 当内容加载完成后，获取评论区所在的位置
    if (this.props.thread.isReady) {
      this.position = this.commentRef?.current?.offsetTop - 50;
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
      sort: this.commentSort ? '-createdAt' : 'createdAt',
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
    this.commentSort = isCreateAt;
    this.page = 1;
    this.loadCommentList();
  }

  // 点击评论
  onInputClick() {
    this.setState({
      showCommentInput: true,
    });
  }

  // 返回
  onBackClick() {
    this.props.router.push('/');
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
      sort: this.commentSort, // 目前的排序
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

  render() {
    const { thread: threadStore } = this.props;
    const { isReady, isCommentReady, isNoMore, totalCount } = threadStore;
    const fun = {
      moreClick: this.onMoreClick,
    };

    return (
      <div className={layout.container}>
        <div className={layout.header}>
          <span onClick={() => this.onBackClick()}>返回</span>
        </div>

        <div className={layout.body} ref={this.threadBodyRef} onScrollCapture={() => this.handleOnScroll()}>
          <ShowTop
            showContent={this.state.showContent}
            setTop={this.state.setTop}>
          </ShowTop>
          {/* 帖子内容 */}
          {
            isReady ? <RenderThreadContent store={threadStore} fun={fun}></RenderThreadContent> : <LoadingTips type='init'></LoadingTips>
          }

          {/* 评论列表 */}
          <div className={`${layout.bottom} ${comment.container}`} ref={this.commentRef}>
            {
              isCommentReady
                ? (
                  <Fragment>
                    <RenderCommentList
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
