import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import createCommentService from '@common/service/comment';

import AuthorInfo from '../../pc/components/author-info/index';
import CommentList from '../../pc/components/comment-list/index';
import RecommendContent from '../../pc/components/recommend-content/index';

import styles from './index.module.scss';
import reply from './reply.module.scss';

import { Icon, Toast  } from '@discuzq/design';


// 回复详情内容
@observer
class RenderReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.service = this.props.service,
    this.state = {
      isShowReward: false, // 是否展示获得多少悬赏金
      isShowRedPacket: true, // 是否展示获得多少红包
      createReplyParams: {},
      commentData: [this.props.commentData],
    };
  }

  componentDidMount() {
    console.log('看看RenderReplyList有啥', this.props);
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
   //  const { commentList } = this.props.store;
   return (
      <Fragment>
        <div className={reply.body}>
          {
            // commentList && commentList
            this.state.commentData && this.state.commentData
              .map((val, index) => (
                <div className={reply.commentItems} key={index}>
                  <CommentList
                    data={val}
                    key={val.id}
                    avatarClick={type => this.avatarClick.bind(this, type)}
                    likeClick={type => this.likeClick.bind(this, val, type)}
                    replyClick={type => this.replyClick.bind(this, val, type)}
                    deleteClick={() => this.deleteClick.bind(this, val)}
                    isPostDetail={false}>
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
@observer
class CommentPCPage extends React.Component {
  constructor(props) {
    super(props);
    this.service = {
      comment: createCommentService(props),
    };
    this.state = {
      isCommentLoading: false, // 列表loading
      commentData: {
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
            likeCount: 0,
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
            likeCount: 0,
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
            likeCount: 0,
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
            likeCount: 0,
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
            likeCount: 0,
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
            likeCount: 0,
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
        ],
      },
    };
  }

  render() {
    return (
      <div className={styles.container}>
      <div className={styles.header}>头部</div>
      <div className={styles.body}>
        {/* 左边内容和评论 */}
        <div className={styles.bodyLeft}>
          {/* 回复详情内容 */}
          <div className={reply.container}>
            <Fragment>
              <RenderReplyList
                totalCount={111}
                commentData={this.state.commentData}
                // store={threadStore}
                service={this.service}>
              </RenderReplyList>
            </Fragment>
          </div>
        </div>
        {/* 右边信息 */}
        <div className={styles.bodyRigth}>
          <div className={styles.authorInfo}>
            <AuthorInfo></AuthorInfo>
          </div>
          <div className={styles.recommend}>
            <RecommendContent></RecommendContent>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default withRouter(CommentPCPage);
