import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import AuthorInfo from './components/author-info/index';
import CommentList from './components/comment-list/index';
import CommentInput from './components/comment-input/index';
import LoadingTips from './components/loading-tips';
import { Icon, Toast, Button, Divider, Dropdown, Popup } from '@discuzq/design';
import UserInfo from '@components/thread/user-info';
import Header from '@components/header';
import NoMore from './components/no-more';
import RewardPopup from './components/reward-popup';

import layout from './layout.module.scss';
import topic from './topic.module.scss';
import comment from './comment.module.scss';

import ReportPopup from './components/report-popup';
import AboptPopup from './components/abopt-popup';
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
import Copyright from '@components/copyright';
import threadPay from '@common/pay-bussiness/thread-pay';
import rewardPay from '@common/pay-bussiness/reward-pay';
import Recommend from '@components/recommend';
import QcCode from '@components/qcCode';

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
const RenderThreadContent = inject('user')(observer((props) => {
  const { store: threadStore } = props;
  const { text, indexes } = threadStore?.threadData?.content || {};
  const tipData = {
    postId: threadStore?.threadData?.postId,
    threadId: threadStore?.threadData?.threadId,
  };
  // 是否合法
  const isApproved = threadStore?.threadData?.isApproved || 0;
  // 是否加精
  const isEssence = threadStore?.threadData?.displayTag?.isEssence || false;
  // 是否置顶
  const isStick = threadStore?.threadData?.isStick;

  // 更多弹窗权限
  const canEdit = threadStore?.threadData?.ability?.canEdit;
  const canDelete = threadStore?.threadData?.ability?.canDelete;
  const canEssence = threadStore?.threadData?.ability?.canEssence;
  const canStick = threadStore?.threadData?.ability?.canStick;

  // 是否附件付费
  const isAttachmentPay = threadStore?.threadData?.payType === 2 && threadStore?.threadData?.paid === false;
  const attachmentPrice = threadStore?.threadData?.attachmentPrice || 0;
  // 是否帖子付费
  const isThreadPay = threadStore?.threadData?.payType === 1 && threadStore?.threadData?.paid === false;
  const threadPrice = threadStore?.threadData?.price || 0;
  // 是否作者自己
  const isSelf = props.user?.userInfo?.id && props.user?.userInfo?.id === threadStore?.threadData.userId;


  const parseContent = {};
  if (indexes && Object.keys(indexes)) {
    Object.entries(indexes).forEach(([, value]) => {
      if (value) {
        const { tomId, body } = value;
        parseContent[typeMap[tomId]] = body;
      }
    });
  }

  const onContentClick = async () => {
    const thread = props.store.threadData;
    const { success } = await threadPay(thread, props.user?.userInfo);

    // 支付成功重新请求帖子数据
    if (success && threadStore?.threadData?.threadId) {
      threadStore.fetchThreadDetail(threadStore?.threadData?.threadId);
    }
  };

  const onLikeClick = () => {
    typeof props.onLikeClick === 'function' && props.onLikeClick();
  };

  const onCollectionClick = () => {
    typeof props.onCollectionClick === 'function' && props.onCollectionClick();
  };

  const onShareClick = () => {
    typeof props.onShareClick === 'function' && props.onShareClick();
  };

  const onBuyClick = (url) => {
    url && window.open(url);
  };

  const onDropdownChange = (key) => {
    typeof props.onOperClick === 'function' && props.onOperClick(key);
  };

  const onRewardClick = () => {
    typeof props.onRewardClick === 'function' && props.onRewardClick();
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
        <div className={topic.more}>
          <div className={topic.iconText}>
            <Dropdown
              menu={<Dropdown.Menu>
                {canEdit && <Dropdown.Item id="edit">编辑</Dropdown.Item>}
                {canStick && <Dropdown.Item id="stick">{isStick ? '取消置顶' : '置顶'}</Dropdown.Item>}
                {canEssence && <Dropdown.Item id="essence"> {isEssence ? '取消精华' : '精华'}</Dropdown.Item>}
                {canDelete && <Dropdown.Item id="delete">删除</Dropdown.Item>}
              </Dropdown.Menu>}
              placement="center"
              hideOnClick={true}
              arrow={false}
              trigger="hover"
              onChange={key => onDropdownChange(key)}
            >
              <Icon className={topic.icon} name="SettingOutlined"></Icon>
              <span className={topic.text}>管理</span>
            </Dropdown>
          </div>
          <div className={topic.iconText} onClick={() => onDropdownChange('report')}>
            <Icon className={topic.icon} name="WarnOutlinedThick"></Icon>
            <span className={topic.text}>举报</span>
          </div>
        </div>
      </div>

      <Divider></Divider>

      {
        isApproved === 1
        && <div className={topic.body} onClick={onContentClick}>
          {/* 文字 */}
          {text && <PostContent useShowMore={false} content={text || ''} />}

          {/* 付费附件 */}
          {
            isAttachmentPay && !isSelf
            && <div style={{ textAlign: 'center' }} onClick={onContentClick}>
              <Button className={topic.payButton} type='primary' size='large'>支付{attachmentPrice}元查看附件</Button>
            </div>
          }

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

          {
            threadStore?.threadData?.categoryName
            && <div className={topic.tag}>{threadStore?.threadData?.categoryName}</div>
          }

          {(parseContent.RED_PACKET || parseContent.REWARD) && (
            <div className={topic.reward}>
              {/* 红包 */}
              {
                parseContent.RED_PACKET && (
                  <PostRewardProgressBar
                    remaining={parseContent.RED_PACKET.remain_number}
                    received={parseContent.RED_PACKET.number - parseContent.RED_PACKET.remain_number} />
                )
              }
              {/* 悬赏 */}
              {
                parseContent.REWARD && <PostRewardProgressBar type={POST_TYPE.BOUNTY} remaining={2} received={5} />
              }
            </div>
          )}

          {/* 帖子付费 */}
          {
            isThreadPay && !isSelf
            && <div style={{ textAlign: 'center' }} onClick={onContentClick}>
              <Button className={topic.payButton} type='primary' size='large'>支付{threadPrice}元查看剩余内容</Button>
            </div>
          }

          {/* 打赏 */}
          <div style={{ textAlign: 'center' }}>
            <Button onClick={onRewardClick} className={topic.rewardButton} type='primary' size='large'>打赏</Button>
          </div>
        </div>
      }
      <div className={topic.footer}>
        <div className={topic.thumbs}>
          <div className={topic.likeReward} >
            <Tip tipData={tipData} imgs={threadStore?.threadData?.likeReward?.users || []}></Tip>
          </div>
          <span>{threadStore?.threadData?.likeReward?.likePayCount || ''}</span>
        </div>
        {
          threadStore?.threadData?.likeReward?.shareCount > 0
          && <span>{threadStore?.threadData?.likeReward?.shareCount}次分享</span>
        }
      </div>
      <Divider></Divider>
      <div className={topic.bottomOperate}>
        <div
          className={classnames(topic.item, threadStore?.threadData?.isLike && topic.active)}
          onClick={onLikeClick}>
          <Icon name="LikeOutlined"></Icon>
          <span>{threadStore?.threadData?.isLike ? '取消' : '赞'}</span>
        </div>
        <div
          className={classnames(topic.item, threadStore?.threadData?.isFavorite && topic.active)}
          onClick={onCollectionClick}>
          <Icon name="CollectOutlined"></Icon>
          <span>{threadStore?.threadData?.isFavorite ? '取消' : '收藏'}</span>
        </div>
        <div className={classnames(topic.item)} onClick={onShareClick}>
          <Icon name="ShareAltOutlined"></Icon>
          <span>分享</span>
        </div>
      </div>

    </div>
  );
}));

// 评论列表
@inject('thread')
@inject('comment')
@inject('user')
@observer
class RenderCommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAboptPopup: false, // 是否弹出采纳弹框
      showCommentInput: false, // 是否弹出评论框
      commentSort: true, // ture 评论从旧到新 false 评论从新到旧
      showDeletePopup: false, // 是否弹出删除弹框
      placeholder: '写下我评论...', // 默认回复框placeholder内容
      commentId: null,
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
      placeholder: userName ? `回复${userName}` : '请输入内容',
      commentId: comment.id,
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
      placeholder: userName ? `回复${userName}` : '请输入内容',
      commentId: null,
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

  // 跳转评论详情
  onCommentClick(data) {
    if (data.id && this.props.thread?.threadData?.id) {
      this.props.router.push(`/thread/comment/${data.id}?threadId=${this.props.thread?.threadData?.id}`);
    }
  }

  // 点击采纳
  onAboptClick(data) {
    this.commentData = data;
    this.setState({ showAboptPopup: true });
  }

  // 悬赏弹框确定
  async onAboptOk(data) {
    if (data > 0 && this.commentData && this.props.thread?.threadData?.threadId) {
      this.setState({ showAboptPopup: false });

      Toast.success({
        content: `成功悬赏${data}元`,
      });
    } else {
      Toast.success({
        content: '悬赏金额不能为0',
      });
    }
    return true;
  }

  // 悬赏弹框取消
  onAboptCancel() {
    this.commentData = null;
    this.setState({ showAboptPopup: false });
  }

  render() {
    const { totalCount, commentList } = this.props.thread;

    // 是否作者自己
    const isSelf = this.props.user?.userInfo?.id
      && this.props.user?.userInfo?.id === this.props.thread?.threadData.userId;

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
          <CommentInput
            height='middle'
            onSubmit={value => this.props.onPublishClick(value)}
            initValue={this.state.inputValue}
            placeholder={this.state.placeholder}>
          </CommentInput>
        </div>

        {/* 评论弹层 */}
        {/* <InputPopup
            visible={this.state.showCommentInput}
            onClose={() => this.onClose()}
            initValue={this.state.inputValue}
            onSubmit={value => this.onPublishClick(value)}
          ></InputPopup> */}

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
                onSubmit={val => this.createReply(val)}
                isShowOne={true}
                isShowInput={this.state.commentId === val.id}
                onAboptClick={() => this.onAboptClick(val)}
                isShowAdopt={isSelf}
              ></CommentList>
            </div>
          ))}
        </div>

        {/* 删除弹层 */}
        <DeletePopup
          visible={this.state.showDeletePopup}
          onClose={() => this.setState({ showDeletePopup: false })}
          onBtnClick={() => this.deleteComment()}
        ></DeletePopup>

        {/* 采纳弹层 */}
        <AboptPopup
          rewardAmount={100} // 需要传入剩余悬赏金额
          visible={this.state.showAboptPopup}
          onCancel={() => this.onAboptCancel()}
          onOkClick={data => this.onAboptOk(data)}
        ></AboptPopup>
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
    this.commentDataSort = false;

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
    console.log(type);

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

  // 确定举报
  onReportOk(val) {
    if (!val) return;
    const params = {
      threadId: this.props.thread.threadData.threadId,
      type: 1,
      reason: val,
      userId: this.props.user.userInfo.id,
    };
    const { success, msg } = this.props.thread.createReports(params);

    if (success) {
      Toast.success({
        content: '操作成功',
      });

      this.setState({ showReportPopup: false });
      return true;
    }

    console.log(msg);

    Toast.error({
      content: msg,
    });
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
        ? this.props.thread.cancelFollow({ id: this.props.thread.threadData.userId, type: 1 })
        : this.props.thread.postFollow(this.props.thread.threadData.userId);
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
            <div className={topic.container}>
              {/* 帖子内容 */}
              {isReady ? (
                <RenderThreadContent
                  store={threadStore}
                  onOperClick={type => this.onOperClick(type)}
                  onLikeClick={() => this.onLikeClick()}
                  onCollectionClick={() => this.onCollectionClick()}
                  onShareClick={() => this.onShareClick()}
                  onReportClick={() => this.onReportClick()}
                  onContentClick={() => this.onContentClick()}
                  onRewardClick={() => this.onRewardClick()}
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
                    onEditClick={comment => this.onEditClick(comment)}
                    onPublishClick={value => this.onPublishClick(value)}>
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
              {
                threadStore?.authorInfo
                  ? <AuthorInfo user={threadStore.authorInfo} onFollowClick={() => this.onFollowClick()}></AuthorInfo>
                  : <LoadingTips type='init'></LoadingTips>
              }
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
        <Popup
          position="center"
          visible={this.state.showCommentInput}
          onClose={() => this.onClose()}
        >
          <div className={layout.editCmment}>
            <div className={layout.close} onClick={() => this.onClose()}>
              <Icon size={18} name="WrongOutlined"></Icon>
            </div>
            <div className={layout.title}>编辑评论</div>
            <div className={layout.user}>
              <UserInfo
                name={this?.comment?.user?.username || ''}
                avatar={this?.comment?.user?.avatar || ''}
                time={`${this?.comment?.updatedAt}` || ''}>
              </UserInfo>
            </div>
            <CommentInput
              height='middle'
              onSubmit={value => this.onPublishClick(value)}
              initValue={this.state.inputValue}>
            </CommentInput>
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
          onCancel={() => this.setState({ showReportPopup: false })}
          onOkClick={data => this.onReportOk(data)}
        ></ReportPopup>

        {/* 打赏弹窗 */}
        <RewardPopup
          visible={this.state.showRewardPopup}
          onCancel={() => this.setState({ showRewardPopup: false })}
          onOkClick={value => this.onRewardSubmit(value)}
        ></RewardPopup>
      </div>
    );
  }
}

export default withRouter(ThreadPCPage);
