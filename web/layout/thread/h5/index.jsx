import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import createThreadService from '@common/service/thread';
import createCommentService from '@common/service/comment';
import layout from './layout.module.scss';
import comment from './comment.module.scss';
import footer from './footer.module.scss';
import topic from './topic.module.scss';
import CommentList from './components/comment-list/index';

import { Icon, Input, Badge, Toast } from '@discuzq/design';
import UserInfo from '@common/components/thread/user-info';

import InputPopup from './components/input-popup';
import ImageContent from '@common/components/thread/image-content';
import AudioPlay from '@common/components/thread/audio-play';
import PostContent from '@common/components/thread/post-content';
import ProductItem from '@common/components/thread/product-item';
import VideoPlay from '@common/components/thread/video-play';
import BottomEvent from '@common/components/thread/bottom-event';
import PostRewardProgressBar, { POST_TYPE } from '@common/components/thread/post-reward-progress-bar';


@inject('site')
@inject('user')
@inject('thread')
@observer
class ThreadH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.service = {
      thread: createThreadService(props),
      comment: createCommentService(props),
    };
    this.state = {
      showCommentInput: false,
      commentSort: true,
      commentDatas: {
        Code: 0,
        Message: '接口调用成功',
        Data: {
          pageData: [
            {
              id: 3,
              userId: 1,
              threadId: 2,
              replyPostId: null,
              replyUserId: null,
              commentPostId: null,
              commentUserId: null,
              content: '1',
              contentHtml: '<p>1</p>',
              replyCount: 4,
              likeCount: 2,
              createdAt: '2021-01-12 15:58:36',
              updatedAt: '2021-02-12 14:01:23',
              isFirst: false,
              isComment: false,
              isApproved: 1,
              rewards: 0,
              canApprove: false,
              canDelete: false,
              canHide: false,
              canEdit: false,
              user: {
                id: 1,
                username: 'admin',
                avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
                realname: '',
                groups: [
                  {
                    id: 1,
                    name: '管理员',
                    isDisplay: false,
                  },
                ],
                isReal: false,
              },
              images: [
                {
                  id: 1,
                  order: 0,
                  type: 1,
                  type_id: 3,
                  isRemote: false,
                  isApproved: 1,
                  url: 'http://dzqfn.l.com/storage/attachments/2021/03/01/smmtFw27HmhpLszqQLBLsHKDWMEk3BCru03MFn1I.jpg',
                  attachment: 'smmtFw27HmhpLszqQLBLsHKDWMEk3BCru03MFn1I.jpg',
                  extension: 'jpg',
                  fileName: 'wallhaven-0jq7pq.jpg',
                  filePath: 'public/attachments/2021/03/01/',
                  fileSize: 481902,
                  fileType: 'image/jpeg',
                  thumbUrl: 'http://dzqfn.l.com/storage/attachments/2021/03/01/smmtFw27HmhpLszqQLBLsHKDWMEk3BCru03MFn1I.jpg',
                },
              ],
              likeState: {
                post_id: 3,
                user_id: 2,
                created_at: '2021-03-15T09:25:09.000000Z',
              },
              canLike: true,
              summary: '<p>1</p>',
              summaryText: '1',
              isDeleted: false,
              redPacketAmount: 0,
              isLiked: true,
              likedAt: '2021-03-15 17:25:09',
              lastThreeComments: [
                {
                  id: 20,
                  userId: 1,
                  threadId: 2,
                  replyPostId: 3,
                  replyUserId: 1,
                  commentPostId: null,
                  commentUserId: null,
                  content: '1-回复4',
                  contentHtml: '<p>1-回复4</p>',
                  replyCount: 0,
                  likCount: 0,
                  createdAt: '2021-02-24 17:38:27',
                  updatedAt: '2021-02-12 14:01:23',
                  isFirst: false,
                  isComment: true,
                  isApproved: 1,
                  rewards: 0,
                  canApprove: false,
                  canDelete: false,
                  canHide: false,
                  canEdit: false,
                  user: {
                    id: 1,
                    username: 'admin',
                    avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
                    realname: '',
                    isReal: false,
                  },
                  images: [],
                  likeState: null,
                  canLike: true,
                  summary: '<p>1-回复4</p>',
                  summaryText: '1-回复4',
                  isDeleted: false,
                  replyUser: {
                    id: 1,
                    username: 'admin',
                    avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
                    realname: '',
                    isReal: false,
                  },
                  isLiked: false,
                  commentUser: null,
                },
                {
                  id: 19,
                  userId: 1,
                  threadId: 2,
                  replyPostId: 3,
                  replyUserId: 1,
                  commentPostId: null,
                  commentUserId: null,
                  content: '1-回复3',
                  contentHtml: '<p>1-回复3</p>',
                  replyCount: 0,
                  likeCount: 0,
                  createdAt: '2021-02-24 17:38:22',
                  updatedAt: '2021-02-12 14:01:23',
                  isFirst: false,
                  isComment: true,
                  isApproved: 1,
                  rewards: 0,
                  canApprove: false,
                  canDelete: false,
                  canHide: false,
                  canEdit: false,
                  user: {
                    id: 1,
                    username: 'admin',
                    avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
                    realname: '',
                    isReal: false,
                  },
                  images: [],
                  likeState: null,
                  canLike: true,
                  summary: '<p>1-回复3</p>',
                  summaryText: '1-回复3',
                  isDeleted: false,
                  replyUser: {
                    id: 1,
                    username: 'admin',
                    avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
                    realname: '',
                    isReal: false,
                  },
                  isLiked: false,
                  commentUser: null,
                },
                {
                  id: 18,
                  userId: 1,
                  threadId: 2,
                  replyPostId: 3,
                  replyUserId: 1,
                  commentPostId: null,
                  commentUserId: null,
                  content: '1-回复2',
                  contentHtml: '<p>1-回复2</p>',
                  replyCount: 0,
                  likeCount: 0,
                  createdAt: '2021-02-24 17:38:15',
                  updatedAt: '2021-02-12 14:01:23',
                  isFirst: false,
                  isComment: true,
                  isApproved: 1,
                  rewards: 0,
                  canApprove: false,
                  canDelete: false,
                  canHide: false,
                  canEdit: false,
                  user: {
                    id: 1,
                    username: 'admin',
                    avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
                    realname: '',
                    isReal: false,
                  },
                  images: [],
                  likeState: null,
                  canLike: true,
                  summary: '<p>1-回复2</p>',
                  summaryText: '1-回复2',
                  isDeleted: false,
                  replyUser: {
                    id: 1,
                    username: 'admin',
                    avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
                    realname: '',
                    isReal: false,
                  },
                  isLiked: false,
                  commentUser: null,
                },
              ],
            },
          ],
          currentPage: 1,
          perPage: 1,
          firstPageUrl: 'http://dzqfn.l.com/api/posts.v2?filter[thread]=2&perPage=1&sort=createdAt&page=1',
          nextPageUrl: 'http://dzqfn.l.com/api/posts.v2?filter[thread]=2&perPage=1&sort=createdAt&page=2',
          prePageUrl: 'http://dzqfn.l.com/api/posts.v2?filter[thread]=2&perPage=1&sort=createdAt&page=2',
          pageLength: 1,
          totalPage: 13,
        },
        RequestId: 'f43d2a13-911f-4026-a645-7793da45d874',
        RequestTime: '2021-03-29 20:05:50',
      },
    };

    // 滚动定位相关属性
    this.threadBodyRef = React.createRef();
    this.commentRef = React.createRef();
    this.position = 0;
    this.nextPosition = 0;
    this.flag = true;
  }

  // TODO:增加节流处理
  handleOnScroll() {
    if (this.flag) {
      this.nextPosition = this.threadBodyRef?.current?.scrollTop || 0;
    }
  }

  componentDidMount() {
    // 当内容加载完成后，获取评论区所在的位置
    this.position = this.commentRef?.current?.offsetTop;
  }
  componentDidMount() {
    console.log('讲过啦');
  }

  componentDidUpdate() {
    // 当内容加载完成后，获取评论区所在的位置
    if (this.props.thread.isReady) {
      this.position = this.commentRef?.current?.offsetTop;
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
    console.log('加载评论列表数据');
  }

  onInputClick() {
    this.setState({
      showCommentInput: true,
    });
  }
  // 评论列表排序
  onSortClick = () => {
    console.log('评论列表排序');
    this.setState({
      commentSort: !this.state.commentSort,
    });
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
  likeClick(type) {
    if (type === '1') {
      Toast.success({
        content: '帖子评论的点赞',
      });
    } else {
      Toast.success({
        content: '评论回复的点赞',
      });
    }
  }
  // 回复
  replyClick(type) {
    if (type === '1') {
      this.onInputClick();
      Toast.success({
        content: '帖子评论的回复',
      });
    } else {
      this.onInputClick();
      Toast.success({
        content: '评论回复的回复',
      });
    }
  }
  // 触底事件
  onScrollBottom(e) {
    console.log('触底啦', e);
  }

  onBackClick() {
    this.props.router.push('/');
  }

  render() {
    const { thread } = this.props;

    return (
      <div className={layout.container}>
        <div className={layout.header}>
          <span onClick={() => this.onBackClick()}>返回</span>
        </div>

        {/* 帖子展示 */}
        <div className={layout.body} ref={this.threadBodyRef} onScrollCapture={() => this.handleOnScroll()}>
          {
            thread.isReady
              ? <div className={`${layout.top} ${topic.container}`}>
                <div className={topic.header}>
                  <UserInfo
                    name={thread?.threadData?.userInfo?.name || ''}
                    avatar={thread?.threadData?.userInfo?.avatar || ''}
                    time='3分钟前'>
                  </UserInfo>
                </div>
                <div className={topic.body}>
                  <PostContent content={thread?.threadData?.content} />
                  <VideoPlay width={400} height={200} />
                  <ImageContent imgData={thread?.threadData?.imgData} />
                  <ProductItem
                    image={thread.threadData?.goods?.image}
                    amount={thread.threadData?.goods?.amount}
                    title={thread.threadData?.goods?.title}
                  />
                  <AudioPlay />
                  <PostRewardProgressBar remaining={5} received={5} />
                  <PostRewardProgressBar type={POST_TYPE.BOUNTY} remaining={2} received={5} />
                  <BottomEvent datas={thread.threadData.bottomEvent.datas} />
                </div>
              </div>
              : '加载中'
          }

          {/* 评论 */}
          <div className={`${layout.bottom} ${comment.container}`} ref={this.commentRef}>
            <div className={comment.header}>
              <div className={comment.number}>
                共{1}条评论
              </div>
              <div className={comment.sort} onClick={() => this.onSortClick()}>
                {
                  this.state.commentSort ? '评论从旧到新' : '评论从新到旧'
                }
              </div>
            </div>
            <div className={comment.body}>
              <div className={comment.commentItems}>
                {
                  this.state.commentDatas.Data.pageData
                    .map((val, index) => <CommentList
                      data={val}
                      key={index}
                      avatarClick={type => this.avatarClick.bind(this, type)}
                      likeClick={type => this.likeClick.bind(this, type)}
                      replyClick={type => this.replyClick.bind(this, type)}>
                    </CommentList>)
                }
              </div>
            </div>
          </div>
        </div>
        {/* 底部操作 */}
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
            onSubmit={value => this.setState({ showCommentInput: false })}>
          </InputPopup>

          {/* 操作区 */}
          <div className={footer.operate}>
            <div className={footer.icon} onClick={() => this.onMessageClick()}>
              <Badge info="99+">
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
