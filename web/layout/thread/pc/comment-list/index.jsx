import React from 'react';
import { inject, observer } from 'mobx-react';
import comment from './index.module.scss';
import AboptPopup from '../components/abopt-popup';
import CommentList from '../components/comment-list/index';
import CommentInput from '../components/comment-input/index';
import DeletePopup from '@components/thread-detail-pc/delete-popup';
import { Icon, Toast } from '@discuzq/design';

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
  };

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
        commentId: null
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
    if (data > 0) {
      const params = {
        postId: this.commentData.id,
        rewards: data,
        threadId: this.props.thread?.threadData?.threadId,
      };
      const { success, msg } = await this.props.thread.reward(params);
      if (success) {
        this.setState({ showAboptPopup: false });
        Toast.success({
          content: `悬赏${data}元`,
        });
        return true;
      }

      Toast.error({
        content: msg,
      });
    } else {
      Toast.success({
        content: '悬赏金额不能为0',
      });
    }
  }

  // 悬赏弹框取消
  onAboptCancel() {
    this.commentData = null;
    this.setState({ showAboptPopup: false });
  }

  render() {
    const { totalCount, commentList } = this.props.thread;

    // 是否作者自己
    const isSelf =
      this.props.user?.userInfo?.id && this.props.user?.userInfo?.id === this.props.thread?.threadData?.userId;

    const isReward = this.props.thread?.threadData?.displayTag?.isReward;

    const { indexes } = this.props.thread?.threadData?.content || {};
    const parseContent = {};
    if (indexes && Object.keys(indexes)) {
      Object.entries(indexes).forEach(([, value]) => {
        if (value) {
          const { tomId, body } = value;
          parseContent[typeMap[tomId]] = body;
        }
      });
    }

    return (
      <div className={comment.container}>
        <div className={comment.header}>
          <div className={comment.number}>共{totalCount}条评论</div>
          <div className={comment.sort} onClick={() => this.onSortClick()}>
            <Icon className={comment.sortIcon} name="SortOutlined" size={14}></Icon>
            <span className={comment.sortText}>{this.state.commentSort ? '评论从新到旧' : '评论从旧到新'}</span>
          </div>
        </div>

        {/* 输入框 */}
        <div className={comment.input}>
          <CommentInput
            height="middle"
            onSubmit={(value) => this.props.onPublishClick(value)}
            initValue={this.state.inputValue}
            placeholder={this.state.placeholder}
          ></CommentInput>
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
                replyLikeClick={(reploy) => this.replyLikeClick(reploy, val)}
                replyReplyClick={(reploy) => this.replyReplyClick(reploy, val)}
                onCommentClick={() => this.onCommentClick(val)}
                onSubmit={(val) => this.createReply(val)}
                isShowOne={true}
                isShowInput={this.state.commentId === val.id}
                onAboptClick={() => this.onAboptClick(val)}
                isShowAdopt={
                  // 是帖子作者 && 是悬赏帖 && 评论人不是作者本人
                  isSelf && isReward && this.props.thread?.threadData?.userId !== val.userId
                }
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
        {parseContent?.REWARD?.money && (
          <AboptPopup
            rewardAmount={parseContent.REWARD.money} // 需要传入剩余悬赏金额
            visible={this.state.showAboptPopup}
            onCancel={() => this.onAboptCancel()}
            onOkClick={(data) => this.onAboptOk(data)}
          ></AboptPopup>
        )}
      </div>
    );
  }
}

export default RenderCommentList