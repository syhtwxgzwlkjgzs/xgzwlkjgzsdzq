import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import CommentList from '../components/comment-list/index';
import { Icon, Toast } from '@discuzq/design';
import InputPopup from '../components/input-popup';

@inject('site')
@inject('user')
@inject('comment')
@inject('thread')
@observer
class CommentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowRedPacket: true,
      isShowReward: false,
      showCommentInput: false, // 是否弹出评论框
      commentSort: true, // ture 评论从旧到新 false 评论从新到旧
      showDeletePopup: false, // 是否弹出删除弹框
      inputText: '请输入内容', // 默认回复框placeholder内容
      commentData: {
        id: 3,
        userId: 1,
        threadId: 2,
        replyPostId: null,
        replyUserId: null,
        commentPostId: null,
        commentUserId: null,
        content: '1哈哈哈哈哈嘿嘿嘿嘿欸欸黑啦啦啦啦啦零，再来几个字',
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

    // this.commentData = null;
    this.replyData = null;
  }
  // 点击更多
  onMoreClick() {
    console.log('点击了更多');
  }

  // 点击评论的赞
  async likeClick(data) {
    if (!data.id) return;

    const params = {
      id: data.id,
      isLiked: !data.isLiked,
    };
    const { success, msg } = await this.props.comment.updateLiked(params, this.props.thread);
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
    const { success, msg } = await this.props.comment.updateLiked(params, this.props.thread);
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

    this.setState({
      showCommentInput: true,
      inputText: reply?.user?.username ? `回复${reply.user.username}` : '请输入内容',
    });
  }

  // 创建回复评论+回复回复接口
  async createReply(val) {
    const { threadId: id } = this.props.comment;
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
        inputText: '请输入内容',
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

  render() {
    // const { commentDetail: commentData, isReady } = this.props.comment;
    // isReady && (commentData.lastThreeComments = commentData?.commentPosts || []);

    return (
      <View className={styles.index}>
        {/* <View className={styles.header}>
          <View className={styles.show}>
            {
              this.state.isShowReward
                ? <View className={styles.showGet}>
                  <View className={styles.icon}>悬赏图标</View>
                  <View className={styles.showMoneyNum}>
                    获得<Text className={styles.moneyNumber}>5.20</Text>元悬赏金
                    </View>
                </View> : ''
            }
            {
              this.state.isShowRedPacket
                ? <View className={styles.showGet}>
                  <View className={styles.icon}>红包图标</View>
                  <View className={styles.showMoneyNum}>
                    获得<Text className={styles.moneyNumber}>5.20</Text>元红包
                    </View>
                </View> : ''
            }
          </View>
          <Icon
            onClick={() => this.onMoreClick()}
            className={styles.more}
            size='20'
            name='ShareAltOutlined'>
          </Icon>
        </View> */}

        {/* 内容 */}
        <View className={styles.content}>
          <CommentList
            data={this.state.commentData}
            avatarClick={() => this.avatarClick(this.state.commentData)}
            likeClick={() => this.likeClick(this.state.commentData)}
            replyClick={() => this.replyClick(this.state.commentData)}
            deleteClick={() => this.deleteClick(this.state.commentData)}
            replyLikeClick={reploy => this.replyLikeClick(reploy, this.state.commentData)}
            replyReplyClick={reploy => this.replyReplyClick(reploy, this.state.commentData)}
            isHideEdit={true}>
          </CommentList>
        </View>

        <View className={styles.footer}>
          {/* 评论弹层 */}
          {/* <InputPopup
            visible={this.state.showCommentInput}
            inputText={this.state.inputText}
            onClose={() => this.setState({ showCommentInput: false })}
            onSubmit={value => this.createReply(value)}>
          </InputPopup> */}
        </View>
      </View>
    );
  }
}

export default CommentPage;
