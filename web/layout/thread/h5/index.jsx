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
      showCommentInput: true,
      commentSort: true,
      commentData: [
        {
          userName: '张三',
          content: '内容你内容内容内容你内容内容内',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
        },
        {
          userName: '张三',
          content: '内容你内容内容内容你内容内容内',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
        },
        {
          userName: '张三',
          content: '内容你内容内容内容你内容内容内',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
        },
        {
          userName: '张三',
          content: '内容你内容内容内容你内容内容内',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
        },
        {
          userName: '张三',
          content: '内容你内容内容内容你内容内容内',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
        },
        {
          userName: '张三',
          content: '内容你内容内容内容你内容内容内',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
        },
        {
          userName: '张三',
          content: '内容你内容内容内容你内容内容内',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
        },
      ],
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
  }

  // 点击收藏
  async onCollectionClick() {
    const id = this.props.thread?.threadData?.thread?.id;
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
        <div className={layout.body}>
          <div className={`${layout.top} ${topic.container}`}>
            <div className={topic.header}>
              <UserInfo
                name={thread?.threadData?.author?.username || ''}
                avatar={thread?.threadData?.author?.avatar || ''}>
              </UserInfo>
            </div>
            <div className={topic.body}>
              {thread?.threadData?.thread.postContent}

              {(thread?.threadData?.images || [])
                .map(image => image.url
                  && <img key={image.id} className={topic.image} src={image.url} alt={image.fileName} />)
              }
            </div>
          </div>

          {/* 评论 */}
          <div className={`${layout.bottom} ${comment.container}`}>
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
                  // this.state.commentData.map((val, index) => <CommentList data={val} key={index}></CommentList>)
                }
                <CommentList data={this.state.commentDatas.Data.pageData[0]}></CommentList>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className={layout.footer}>
          {/* 评论区触发 */}
          <Input
            className={footer.input}
            placeholder="写评论"
            disabled={true}>
          </Input>

          {/* 评论弹层 */}
          <InputPopup
            visible={this.state.showCommentInput}
            onClose={() => this.setState({ showCommentInput: false })}
            onSubmit={value => this.setState({ showCommentInput: false })}>
          </InputPopup>

          {/* 操作区 */}
          <div className={footer.operate}>
            <Badge info="99+">
              <Icon className={footer.icon} size='20' name='MessageOutlined'></Icon>
            </Badge>
            <Icon
              color={this.props.thread?.isFavorite ? 'blue' : ''}
              className={footer.icon}
              onClick={() => this.onCollectionClick()}
              size='20'
              name='HeartOutlined'>
            </Icon>
            <Icon
              onClick={() => this.onInputClick()}
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
