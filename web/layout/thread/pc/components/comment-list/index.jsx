import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import ReplyList from '../reply-list/index';
import { diffDate } from '@common/utils/diff-date';
import { observer } from 'mobx-react';
import { Icon, Divider } from '@discuzq/design';
import classnames from 'classnames';
import CommentInput from '../comment-input/index';
import RewardDisplay from '@components/thread-detail-pc/reward-display';
import RedPacketDisplay from '@components/thread-detail-pc/red-packet-display';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';

@observer
class CommentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowOne: this.props.isShowOne || false, // 是否只显示一条评论回复
      isFirstDivider: false, // 第一条评论下的回复是否分割线
      isShowInput: this.props.isShowInput, // 是否显示输入框
      replyId: null,
      placeholder: '输入你的回复',
    };
    this.needReply = this.props.data.lastThreeComments; // 评论的回复
  }

  toCommentDetail = () => {
    if (this.state.isShowOne) {
      typeof this.props.onCommentClick === 'function' && this.props.onCommentClick();
    }
  };

  filterContent() {
    let newContent = this.props?.data?.content || '';
    newContent = s9e.parse(newContent);
    newContent = xss(newContent);

    return newContent;
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

  reportClick(data) {
    typeof this.props.reportClick === 'function' && this.props.reportClick(data);
  }

  async onSubmit(value) {
    if (typeof this.props.onSubmit === 'function') {
      const success = await this.props.onSubmit(value);
      if (success) {
        this.setState({
          replyId: null,
        });
      }
    }
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
        {this.props.data?.rewards || this.props.data?.redPacketAmount ? (
          <div className={styles.header}>
            {this.props.data?.rewards ? <RewardDisplay number={this.props.data.rewards}></RewardDisplay> : ''}

            {this.props.data?.redPacketAmount ? (
              <div className={styles.redpacket}>
                <RedPacketDisplay number={this.props.data.redPacketAmount}></RedPacketDisplay>
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
        <div className={styles.content}>
          <div className={styles.commentListAvatar} onClick={() => this.avatarClick()}>
            <Avatar
              image={this.props.data.user.avatar}
              name={this.props.data.user.username || this.props.data.user.userName || ''}
              circle={true}
              userId={this.props.data.user.id}
              isShowUserInfo={this.props.isShowOne}
            ></Avatar>
          </div>
          <div className={styles.commentListContent}>
            {/* 评论内容 */}
            <div className={classnames(styles.commentListContentText, this.props.isShowOne && styles.hover)} onClick={() => this.toCommentDetail()}>
              <div className={styles.commentListName}>
                {this.props.data.user.username || this.props.data.user.userName}
              </div>
              <div className={styles.commentListText} dangerouslySetInnerHTML={{ __html: this.filterContent() }}></div>
            </div>

            <div className={styles.commentListFooter}>
              {/* 操作按钮 */}
              {!this.props.isFirstDivider && (
                <div className={styles.commentBtn}>
                  <div className={styles.commentTime}>{diffDate(this.props.data.createdAt)}</div>
                  <div className={styles.extraBottom}>
                    <div
                      className={classnames(styles.commentLike, this.props?.data?.isLiked && styles.active)}
                      onClick={() => this.likeClick(canLike)}
                    >
                      <Icon className={styles.icon} name="LikeOutlined"></Icon>
                      赞&nbsp;{this.props?.data?.likeCount > 0 ? this.props.data.likeCount : ''}
                    </div>
                    <div
                      className={classnames(
                        styles.commentReply,
                        this.props.isShowInput && this.state.isShowInput && styles.active,
                      )}
                      onClick={() => this.replyClick()}
                    >
                      <Icon className={styles.icon} name="MessageOutlined"></Icon>
                      <span>回复</span>
                    </div>
                    {this.props.isShowAdopt ? (
                      <div className={styles.commentAdopt}>
                        <Icon className={styles.icon} name="ExactnessOutlined"></Icon>
                        <span onClick={() => this.props.onAboptClick()}>采纳</span>
                      </div>
                    ) : (
                      ''
                    )}
                    {/* {canEdit && (
                          <div className={styles.revise} onClick={() => this.editClick()}>
                            编辑
                          </div>
                        )} */}
                    {canDelete && (
                      <div className={styles.revise} onClick={() => this.deleteClick()}>
                        <Icon className={styles.icon} name="DeleteOutlined"></Icon>
                        <span>删除</span>
                      </div>
                    )}

                    <div className={styles.revise} onClick={() => this.reportClick()}>
                      <Icon className={styles.icon} name="WarnOutlined"></Icon>
                      <span>举报</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 回复输入框 */}
              {this.props.isShowInput && this.state.isShowInput && (
                <div className={styles.commentInput}>
                  <CommentInput
                    height="label"
                    onSubmit={(value) => this.onSubmit(value)}
                    placeholder={this.state.placeholder}
                  ></CommentInput>
                </div>
              )}
              {this.props.data?.replyCount - 1 > 0 && this.state.isShowOne ? (
                <div className={styles.moreReply} onClick={() => this.toCommentDetail()}>
                  查看之前{this.props.data?.replyCount - 1}条回复...
                </div>
              ) : (
                ''
              )}

              {this.props.isFirstDivider && <Divider className={styles.divider}></Divider>}

              {/* 回复列表 */}
              {this.needReply?.length > 0 && (
                <div className={styles.replyList}>
                  {this.state.isShowOne ? (
                    <ReplyList
                      data={this.needReply[0]}
                      key={this.needReply[0].id}
                      isShowOne={true}
                      avatarClick={() => this.reployAvatarClick(this.needReply[0])}
                      likeClick={() => this.replyLikeClick(this.needReply[0])}
                      replyClick={() => this.replyReplyClick(this.needReply[0])}
                      toCommentDetail={() => this.toCommentDetail()}
                      onSubmit={(value) => this.onSubmit(value)}
                      isShowInput={this.state.replyId && this.state.replyId === this.needReply[0].id}
                    ></ReplyList>
                  ) : (
                    (this.needReply || []).map((val, index) => (
                      <ReplyList
                        data={val}
                        key={val.id || index}
                        avatarClick={() => this.reployAvatarClick(val)}
                        likeClick={() => this.replyLikeClick(val)}
                        replyClick={() => this.replyReplyClick(val)}
                        toCommentDetail={() => this.toCommentDetail()}
                        onSubmit={(value) => this.onSubmit(value)}
                        isShowInput={this.state.replyId && this.state.replyId === val.id}
                      ></ReplyList>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentList;
