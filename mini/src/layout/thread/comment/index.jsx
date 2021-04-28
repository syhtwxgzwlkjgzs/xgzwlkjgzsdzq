import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import CommentList from '../components/comment-list/index';
import { Icon, Toast } from '@discuzq/design';
import InputPopup from '../components/input-popup';
import MorePopup from '../components/more-popup';
import DeletePopup from '../components/delete-popup';

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
      showMorePopup: false,
      commentSort: true, // ture 评论从旧到新 false 评论从新到旧
      showDeletePopup: false, // 是否弹出删除弹框
      inputText: '请输入内容', // 默认回复框placeholder内容
      inputValue: '',
    };
    this.commentData = null;
    this.replyData = null;
    this.comment = null;
  }
  // 点击更多
  onMoreClick() {
    console.log('点击了更多');
    this.setState({ showMorePopup: true });
  }

  // 点击发布按钮
  onPublishClick(val) {
    console.log('呀呀呀呀', this.comment);
    this.comment ? this.updateComment(val) : this.createReply(val);
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
    console.log('更新评论', params);
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

  // 点击编辑
  onEditClick(comment) {
    this.comment = comment;
    this.setState({
      inputValue: comment.content,
      showCommentInput: true,
    });
  }

  // 更多中的操作
  onOperClick = (type) => {
    this.setState({ showMorePopup: false });

    // 编辑
    if (type === 'edit') {
      // console.log('点击了编辑', this.props.comment.commentDetail);
      this.onEditClick(this.props.comment.commentDetail);
    }

    // 删除
    if (type === 'delete') {
      this.commentData = this.state.commentData;
      this.setState({ showDeletePopup: true });
    }

    // 举报
    if (type === 'report') {
      console.log('点击举报');
    }
  };

  // 点击评论的赞
  async likeClick(data) {
    console.log(this.props);
    if (!data.id) return;

    const params = {
      id: data.id,
      isLiked: !data.isLiked,
    };
    const { success, msg } = await this.props.comment.updateLiked(params, this.props.thread);

    if (success) {
      this.props.comment.setCommentDetailField('isLiked', params.isLiked);
      const likeCount = params.isLiked ? data.likeCount + 1 : data.likeCount - 1;
      this.props.comment.setCommentDetailField('likeCount', likeCount);
    }

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

    if (success) {
      this.props.comment.setReplyListDetailField(reply.id, 'isLiked', params.isLiked);
      const likeCount = params.isLiked ? reply.likeCount + 1 : reply.likeCount - 1;
      this.props.comment.setReplyListDetailField(reply.id, 'likeCount', likeCount);
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

  // 确定删除
  onBtnClick() {
    this.deleteComment();
    this.setState({ showDeletePopup: false });
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

  render() {
    const { commentDetail, isReady } = this.props.comment;
    isReady && (commentDetail.lastThreeComments = commentDetail?.commentPosts || []);

    console.log('9527', this.props, commentDetail);

    // 更多弹窗权限
    const morePermissions = {
      canEdit: commentDetail?.canEdit,
      canDelete: commentDetail?.canDelete,
      canEssence: false,
      canStick: false,
    };


    // 更多弹窗界面
    const moreStatuses = {
      isEssence: false,
      isStick: false,
    };

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
          {
            commentDetail && (
              <CommentList
                data={commentDetail}
                avatarClick={() => this.avatarClick(commentDetail)}
                likeClick={() => this.likeClick(commentDetail)}
                replyClick={() => this.replyClick(commentDetail)}
                deleteClick={() => this.deleteClick(commentDetail)}
                replyLikeClick={reploy => this.replyLikeClick(reploy, commentDetail)}
                replyReplyClick={reploy => this.replyReplyClick(reploy, commentDetail)}
                onMoreClick={() => this.onMoreClick()}
                isHideEdit>
              </CommentList>
            )
          }
        </View>

        <View className={styles.footer}>
          {/* 评论弹层 */}
          <InputPopup
            visible={this.state.showCommentInput}
            inputText={this.state.inputText}
            initValue={this.state.inputValue}
            onClose={() => this.setState({ showCommentInput: false })}
            onSubmit={value => this.onPublishClick(value)}>
          </InputPopup>

          {/* 更多弹层 */}
          <MorePopup
            permissions={morePermissions}
            statuses={moreStatuses}
            visible={this.state.showMorePopup}
            onClose={() => this.setState({ showMorePopup: false })}
            onSubmit={() => this.setState({ showMorePopup: false })}
            onOperClick={type => this.onOperClick(type)}
          />

          {/* 删除弹层 */}
          <DeletePopup
            visible={this.state.showDeletePopup}
            onClose={() => this.setState({ showDeletePopup: false })}
            onBtnClick={type => this.onBtnClick(type)}
          />
        </View>
      </View>
    );
  }
}

export default CommentPage;
