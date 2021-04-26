import React, { Fragment, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import RecommendContent from './components/recommend-content/index';
import AuthorInfo from './components/author-info/index';
import CommentList from './components/comment-list/index';
import Input from './components/input/index';
import LoadingTips from './components/loading-tips';
import { Icon, Toast, Tag, Button, Card, Menu  } from '@discuzq/design';
import UserInfo from '@components/thread/user-info';

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
  const [isShowOperation, setShowOperation] = useState(false);
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

  // 点击管理
  const onManageClick = () => {
    setShowOperation(!isShowOperation);
  };

  const onOperClick = (type) => {
    if (type !== '4') {
      setShowOperation(!isShowOperation);
    }
    props.fun.onOperClick(type);
  };

  return (
    <div className={`${layout.top}`}>
      <div className={topic.header}>
        <UserInfo
          name={threadStore?.threadData?.user?.userName || ''}
          avatar={threadStore?.threadData?.user?.avatar || ''}
          location='腾讯大厦'
          view={`${threadStore?.threadData?.viewCount || ''}`}
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
              <div onClick={() => onOperClick('4')}>
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
        {
          isShowOperation ? <div className={topic.operation}>
            <div className={topic.triangle}></div>
            <div className={topic.operationBtn}>
              <div className={topic.btn} onClick={() => onOperClick('5')}>编辑</div>
              <div className={topic.btn} onClick={() => onOperClick('2')}>精华</div>
              <div className={topic.btn} onClick={() => onOperClick('1')}>置顶</div>
              <div className={topic.btn} onClick={() => onOperClick('3')}>删除</div>
            </div>
          </div> : ''
        }
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
    this.state = {
      isShowReward: false, // 是否展示获得多少悬赏金
      isShowRedPacket: true, // 是否展示获得多少红包
      commentSort: false, // 评论列表排序
      createReplyParams: {},
    };
    this.commentId = '';
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
 async likeClick(data) {
   console.log(data);
   if (data.id) return;

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
 deleteClick(data) {
   console.log('deleteClick', data);
   this.setState({ showDeletePopup: true });
   this.commentId = data;
 }

 // 删除
 async deleteComment() {
   this.setState({ showDeletePopup: false });
   if (this.commentId) return;

   const { success, msg } = await this.props.service.comment.delete(this.commentId);
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

 replyClick = (data) => {
   console.log(data);
   const id = this.props.store.thread?.threadData?.id;
   const params = {
     id, // 帖子id
     content: '', // 评论内容
     commentId: 1, // 评论id
     replyId: 1, // 回复id
     isComment: 1, // 是否楼中楼
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
   const id = this.props.thread?.threadData?.id;
   const params = {
     id,
     content: val,
     sort: this.commentSort, // 目前的排序
     isNoMore: false,
     attachments: [],
   };
   const { success, msg } = await this.service.comment.createComment(params, this.props.thread);
   if (success) {
     Toast.success({
       content: '评论成功',
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
          <Input onSubmit={value => this.onPublishClick(value)} height='middle'></Input>
        </div>
        <div className={comment.body}>
          {
            commentList && commentList
              .map((val, index) => (
                <div className={comment.commentItems} key={index}>
                  <CommentList
                    data={val}
                    key={val.id}
                    avatarClick={type => this.avatarClick(type)}
                    likeClick={data => this.likeClick(data)}
                    replyClick={data => this.replyClick(data)}
                    deleteClick={data => this.deleteClick(data)}
                    createReply={data => this.createReply(data)}
                    isPostDetail={true}>
                  </CommentList>
                </div>
              ))
          }
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
      isCommentLoading: false, // 列表loading
      showDeletePopup: false, // 是否显示删除弹框
      setTop: false, // 置顶
      showContent: '',
    };
    this.props.comment.injectStore && this.props.comment.injectStore({
      thread: this.props.thread,
    });
  }

  onOperClick = (type) => {
    // 1 置顶  2 加精  3 删除  4 举报  5 编辑
    // this.setState({ showMorePopup: false });
    if (type === '1') {
      this.updateSticky();
    } else if (type === '2') {
      this.updateEssence();
    } else if (type === '3') {
      this.setState({ showDeletePopup: true });
    } else if (type === '4') {
      console.log('举报');
    } else {
      console.log('编辑');
    }
  };

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
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      pid: this.props.thread?.threadData?.postId,
      isSticky: !this.props.thread?.isSticky,
    };
    const { success, msg } = await this.service.thread.updateSticky(params);

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
      pid: this.props.thread?.threadData?.postId,
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
    const pid = this.props.thread?.threadData?.postId;

    const { success, msg } = await this.service.thread.delete(id, pid);

    if (success) {
      Toast.success({
        content: '删除成功',
      });

      setTimeout(() => {
        this.props.router.push('/');
      }, 500);

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
      onOperClick: this.onOperClick,
    };
    return (
      <div className={layout.container}>
        <ShowTop showContent={this.state.showContent} setTop={this.state.setTop}></ShowTop>
        <div className={layout.header}>头部</div>
        <div className={layout.body}>
          {/* 左边内容和评论 */}
          <div className={layout.bodyLeft}>
            <div className={topic.container}>
            {/* 帖子内容 */}
            {
              isReady ? <RenderThreadContent store={threadStore} fun={fun}></RenderThreadContent> : <LoadingTips type='init'></LoadingTips>
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
        <DeletePopup
          visible={this.state.showDeletePopup}
          onClose={() => this.setState({ showDeletePopup: false })}
          onBtnClick={() => this.delete()}
        ></DeletePopup>
      </div>
    );
  }
}

export default withRouter(ThreadPCPage);
