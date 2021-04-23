import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import createThreadService from '@common/service/thread';
import createCommentService from '@common/service/comment';

import RecommendContent from './components/recommend-content/index';
import AuthorInfo from './components/author-info/index';
import CommentList from './components/comment-list/index';
import Input from './components/input/index';
import LoadingTips from './components/loading-tips';
import { Icon, Toast, Tag, Button  } from '@discuzq/design';
import UserInfo from '@components/thread/user-info';

import layout from './layout.module.scss';
import topic from './topic.module.scss';
import comment from './comment.module.scss';

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

  const onManageClick = () => {
    Toast.success({
      content: '管理',
    });
  };
  const onRepoRrtClick = () => {
    Toast.success({
      content: '举报',
    });
  };

  return (
    <div className={`${layout.top}`}>
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
          <div className={topic.headerRigth}>
            <div className={topic.manage}>
              <div onClick={onManageClick}>
                <Icon
                  size='18'
                  className={topic.icon}
                  name='ShareAltOutlined'>
                </Icon>
                <span>管理</span>
              </div>
            </div>
            <div className={topic.report}>
              <div onClick={onRepoRrtClick}>
                <Icon
                  size='18'
                  className={topic.icon}
                  name='WarnOutlined'>
                </Icon>
                <span>举报</span>
              </div>
            </div>
          </div>
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
            {
              parseContent.RED_PACKET
              && <PostRewardProgressBar remaining={parseContent.RED_PACKET.number} received={1} />
            }
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
        <div className={topic.Collection}>收藏</div>
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
      isShowReward: false, // 是否展示获得多少悬赏金
      isShowRedPacket: true, // 是否展示获得多少红包
      createReplyParams: {},
    };
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
 async likeClick(commentData, replyData) {
   console.log(commentData, replyData);
   let pid = '';
   let liked = '';
   if (replyData) {
     const { id, isLiked } = replyData;
     pid = id;
     liked = !isLiked;
   } else {
     const { id, isLiked } = commentData;
     pid = id;
     liked = !isLiked;
   }
   if (pid) return;

   const params = {
     pid,
     isLiked: liked,
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
 replyClick(commentData, replyData) {
   console.log(commentData, replyData);
   const id = this.props.store.thread?.threadData?.id;
   const params = {
     id, // 帖子id
     content: '', // 评论内容
     commentId: commentData.id, // 评论id
     replyId: replyData?.id, // 回复id
     isComment: replyData !== undefined, // 是否楼中楼
     commentPostId: [], // 评论回复ID
     commentUserId: [], // 评论回复用户ID
     attachments: [], // 附件内容
   };
   this.setState({
     createReplyParams: params,
   });
 }
 // 创建回复评论+回复回复接口
 async createReply(val) {
   console.log(val);
   this.setState({ showCommentInput: false });
   const params = this.state.createReplyParams;
   params.content = val;
   console.log('参数', params);
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

 // 创建帖子评论
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
              <div className={comment.input}>
                <Input onSubmit={value => this.onPublishClick(value)}></Input>
              </div>
              <div className={comment.body}>
                {
                  commentList && commentList
                    .map((val, index) => (
                      <div className={comment.commentItems} key={index}>
                        <CommentList
                          data={val}
                          key={val.id}
                          avatarClick={type => this.avatarClick.bind(this, type)}
                          likeClick={type => this.likeClick.bind(this, val, type)}
                          replyClick={type => this.replyClick.bind(this, val, type)}
                          deleteClick={() => this.deleteClick.bind(this, val)}
                          isPostDetail={true}>
                        </CommentList>
                      </div>
                    ))
                }
              </div>
      </Fragment>
   );
 }
}

@inject('site')
@inject('user')
@inject('thread')
@observer
class ThreadPCPage extends React.Component {
  constructor(props) {
    super(props);
    this.service = {
      thread: createThreadService(props),
      comment: createCommentService(props),
    };
    this.state = {
      isCommentLoading: false, // 列表loading
    };
  }


  render() {
    const { thread: threadStore } = this.props;
    const { isReady, isCommentReady, isNoMore, totalCount } = threadStore;
    return (
      <div className={layout.container}>
        <div className={layout.header}>头部</div>
        <div className={layout.body}>
          {/* 左边内容和评论 */}
          <div className={layout.bodyLeft}>
            <div className={topic.container}>
            {/* 帖子内容 */}
            {
              isReady ? <RenderThreadContent store={threadStore}></RenderThreadContent> : <LoadingTips type='init'></LoadingTips>
            }
            </div>

            {/* 回复详情内容 */}
            <div className={comment.container}>
            {
              isCommentReady
                ? (
                <Fragment>
                  <RenderCommentList
                    totalCount={totalCount}
                    store={threadStore}
                    service={this.service}
                    sort={flag => this.onSortChange(flag)}>
                  </RenderCommentList>
                </Fragment>
                )
                : <LoadingTips type='init'></LoadingTips>
            }

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
      </div>
    );
  }
}

export default withRouter(ThreadPCPage);
