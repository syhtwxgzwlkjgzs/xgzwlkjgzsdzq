import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import ReplyList from '../reply-list/index';
import { diffDate } from '@common/utils/diff-date';
import { observer } from 'mobx-react';
import { Icon } from '@discuzq/design';
import classnames from 'classnames';
import CommentInput from '../comment-input/index';

@observer
class CommentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHideEdit: this.props.isHideEdit, // 隐藏评论编辑删除
      isShowOne: this.props.isShowOne || false, // 是否只显示一条评论回复
      isShowInput: this.props.isShowInput, // 是否显示输入框
      replyId: null,
      placeholder: '输入你的回复',
    };
    this.needReply = this.props.data.lastThreeComments;// 评论的回复
  }

  toCommentDetail = () => {
    if (this.state.isShowOne) {
      typeof this.props.onCommentClick === 'function' && this.props.onCommentClick();
    }
  }

  // 点击头像
  avatarClick() {
    typeof this.props?.avatarClick === 'function' && this.props.avatarClick();
  }

  // 点击评论赞
  likeClick() {
    typeof this.props.likeClick === 'function' && this.props.likeClick();
  }

  // 点击评论回复
  replyClick() {
    const userName = this.props.data?.user?.username || this.props.data?.user?.userName;

    this.setState({
      isShowInput: !this.state.isShowInput,
      replyId: null,
      placeholder: userName ? `回复${userName}` : '请输入内容',
    });
    typeof this.props.replyClick === 'function' && this.props.replyClick();
  }

  // 点击评论删除
  deleteClick() {
    typeof this.props.deleteClick === 'function' && this.props.deleteClick();
  }

  // 点击评论编辑
  editClick() {
    typeof this.props.editClick === 'function' && this.props.editClick();
  }

  // 点击回复赞
  replyLikeClick(data) {
    typeof this.props.replyLikeClick === 'function' && this.props.replyLikeClick(data);
  }

  // 点击回复回复
  replyReplyClick(data) {
    this.setState({
      replyId: data?.id,
    });

    typeof this.props.replyReplyClick === 'function' && this.props.replyReplyClick(data);
  }

  reployAvatarClick(data) {
    typeof this.props.reployAvatarClick === 'function' && this.props.reployAvatarClick(data);
  }

  generatePermissions(data = {}) {
    return {
      canApprove: data.canApprove || false,
      canDelete: data.canDelete || false,
      canEdit: data.canEdit || false,
      canHide: data.canLike || false,
      canLike: data.canLike || false,
    };
  }

  render() {
    const { canDelete, canEdit, canLike } = this.generatePermissions(this.props.data);

    return (
      <div className={styles.commentList}>
        <div className={styles.header}>
          <div className={styles.showGet}>
            {!this.state.isHideEdit
              && <div className={styles.extra}>
                {canEdit && <div className={styles.revise} onClick={() => this.editClick()}>编辑</div>}
                {canDelete && <div className={styles.revise} onClick={() => this.deleteClick()}>删除</div>}
              </div>
            }
            {
              this.props.data?.rewards
                ? <div>
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>{this.props.data.rewards}</span>元悬赏金
                  </div>
                </div>
                : ''
            }
            {
              this.props.data?.redPacketAmount
                ? <div>
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>{this.props.data.redPacketAmount}</span>元红包
                  </div>
                </div>
                : ''
            }
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.commentListAvatar} onClick={() => this.avatarClick()}>
            <Avatar
              image={this.props.data.user.avatar}
              name={this.props.data.user.username || this.props.data.user.userName || ''}
              circle={true}
              userId={this.props.data.user.id}
              isShowPopup={true}>
            </Avatar>
          </div>
          <div className={styles.commentListContent}>
            {/* 评论内容 */}
            <div className={styles.commentListContentText} onClick={() => this.toCommentDetail()}>
              <div className={styles.commentListName}>
                {this.props.data.user.username || this.props.data.user.userName}
              </div>
              <div className={styles.commentListText}>
                {this.props.data.content}
              </div>
            </div>

            <div className={styles.commentListFooter}>
              {/* 操作按钮 */}
              <div className={styles.commentBtn}>
                <div className={styles.commentTime}>{diffDate(this.props.data.createdAt)}</div>
                <div className={styles.extraBottom}>
                  <div
                    className={classnames(styles.commentLike, this.props?.data?.isLiked && styles.active)}
                    onClick={() => this.likeClick(canLike)}>
                    <Icon className={styles.icon} name="LikeOutlined"></Icon>
                      赞&nbsp;{this.props?.data?.likeCount > 0 ? this.props.data.likeCount : ''}
                  </div>
                  <div
                    className={
                      classnames(styles.commentReply, this.props.isShowInput && this.state.isShowInput && styles.active)
                    }
                    onClick={() => this.replyClick()}>
                    <Icon className={styles.icon} name="MessageOutlined"></Icon>
                    <span>回复</span>
                  </div>
                  {
                    this.props.isShowAdopt
                      ? <div className={styles.commentAdopt}>
                        <Icon className={styles.icon} name="ExactnessOutlined"></Icon>
                        <span onClick={() => this.props.onAboptClick()}>采纳</span>
                      </div> : ''
                  }
                </div>
              </div>

              {/* 回复输入框 */}
              {this.props.isShowInput && this.state.isShowInput
                && <div className={styles.commentInput}>
                  <CommentInput
                    height='label'
                    onSubmit={value => this.props.onSubmit(value)}
                    placeholder={this.state.placeholder}>
                  </CommentInput>
                </div>
              }
              {
                this.props.data?.replyCount - 1 > 0 && this.state.isShowOne
                  ? <div
                    className={styles.moreReply}
                    onClick={() => this.toCommentDetail()}>
                    查看之前{this.props.data?.replyCount - 1}条回复...
                    </div> : ''
              }
              {/* 回复列表 */}
              {
                this.needReply?.length > 0
                && <div className={styles.replyList}>
                  {
                    this.state.isShowOne
                      ? <ReplyList
                        data={this.needReply[0]}
                        key={this.needReply[0].id}
                        avatarClick={() => this.reployAvatarClick(this.needReply[0])}
                        likeClick={() => this.replyLikeClick(this.needReply[0])}
                        replyClick={() => this.replyReplyClick(this.needReply[0])}
                        toCommentDetail={() => this.toCommentDetail()}
                        onSubmit={value => this.props.onSubmit(value)}
                        isShowInput={this.state.replyId && this.state.replyId === this.needReply[0].id}>
                      </ReplyList>
                      : (this.needReply || [])
                        .map((val, index) => (
                          <ReplyList
                            data={val}
                            key={val.id || index}
                            avatarClick={() => this.reployAvatarClick(val)}
                            likeClick={() => this.replyLikeClick(val)}
                            replyClick={() => this.replyReplyClick(val)}
                            toCommentDetail={() => this.toCommentDetail()}
                            onSubmit={value => this.props.onSubmit(value)}
                            isShowInput={this.state.replyId && this.state.replyId === val.id}>
                          </ReplyList>
                        ))
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentList;
