import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import CommentList from '../../h5/components/comment-list/index';
import Header from '@components/header';
import { Icon, Toast } from '@discuzq/design';
import InputPopup from '../../h5/components/input-popup';

@inject('site')
@inject('user')
@inject('comment')
@inject('thread')
@observer
class CommentH5Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCommentInput: false, // 是否弹出评论框
      commentSort: true, // ture 评论从旧到新 false 评论从新到旧
      showDeletePopup: false, // 是否弹出删除弹框
      inputText: '请输入内容', // 默认回复框placeholder内容
    };

    this.commentData = null;
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
    const { commentDetail: commentData, isReady } = this.props.comment;

    return (
      <div className={styles.index}>
        <Header></Header>
        {/* <div className={styles.header}>
          <div className={styles.show}>
            {
              this.state.isShowReward
                ? <div className={styles.showGet}>
                  <div className={styles.icon}>悬赏图标</div>
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>5.20</span>元悬赏金
                    </div>
                </div> : ''
            }
            {
              this.state.isShowRedPacket
                ? <div className={styles.showGet}>
                  <div className={styles.icon}>红包图标</div>
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>5.20</span>元红包
                    </div>
                </div> : ''
            }
          </div>
          <Icon
            onClick={() => this.onMoreClick()}
            className={styles.more}
            size='20'
            name='ShareAltOutlined'>
          </Icon>
        </div> */}

        {/* 内容 */}
        <div className={styles.content}>
          {isReady
            && <CommentList
              data={commentData}
              avatarClick={() => this.avatarClick(commentData)}
              likeClick={() => this.likeClick(commentData)}
              replyClick={() => this.replyClick(commentData)}
              deleteClick={() => this.deleteClick(commentData)}
              replyLikeClick={reploy => this.replyLikeClick(reploy, commentData)}
              replyReplyClick={reploy => this.replyReplyClick(reploy, commentData)}
              isHideEdit={true}>
            </CommentList>
          }
        </div>

        <div className={styles.footer}>
          {/* 评论弹层 */}
          <InputPopup
            visible={this.state.showCommentInput}
            inputText={this.state.inputText}
            onClose={() => this.setState({ showCommentInput: false })}
            onSubmit={value => this.createReply(value)}>
          </InputPopup>
        </div>
      </div>
    );
  }
}

export default withRouter(CommentH5Page);

