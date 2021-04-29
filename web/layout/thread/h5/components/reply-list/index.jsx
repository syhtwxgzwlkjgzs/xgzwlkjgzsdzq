import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { diffDate } from '@common/utils/diff-date';
import { observer } from 'mobx-react';
@observer
export default class ReplyList extends React.Component {
  // 跳转至评论详情
  toCommentDetail() {
    console.log('跳至评论详情');
  }

  likeClick() {
    typeof this.props.likeClick === 'function' && this.props.likeClick();
  }
  replyClick() {
    typeof this.props.replyClick === 'function' && this.props.replyClick();
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
    const { canLike } = this.generatePermissions(this.props.data);

    return (
      <div className={styles.replyList}>
        <div className={styles.replyListAvatar} onClick={this.props.avatarClick('2')}>
          <Avatar
            image={this.props.data.user.avatar}
            name={this.props.data.user.username || this.props.data.user.userName || ''}
            circle={true}
            size='small'>
          </Avatar>
        </div>
        <div className={styles.replyListContent}>
          <div className={styles.replyListContentText}>
            <div className={styles.replyListName}>
              {this.props.data.user.username || this.props.data.user.userName}
            </div>
            <div className={styles.replyListText}>
              {
                this.props.data.commentUserId
                  ? <div className={styles.commentUser}>
                    <div className={styles.replyedAvatar} onClick={this.props.avatarClick('3')}>
                      <Avatar
                        image={this.props.data.replyUser.avatar}
                        name={this.props.data.replyUser.username || this.props.data.replyUser.userName || ''}
                        circle={true}
                        size='small'>
                      </Avatar>
                    </div>
                    <span className={styles.replyedUserName}>
                      {this.props.data.replyUser.username || this.props.data.replyUser.userName}
                    </span>
                  </div> : ''
              }
              <span onClick={() => this.props.toCommentDetail()}>{this.props.data.content}</span>
            </div>
          </div>
          <div className={styles.replyListFooter}>
            <div className={styles.replyTime}>{diffDate(this.props.data.createdAt)}</div>
            <div className={styles.extraBottom}>
              <div className={this.props?.data?.isLiked ? styles.replyLike : styles.replyLiked}>
                <span onClick={() => this.likeClick(canLike)}>
                  赞&nbsp;{ this.props?.data?.likeCount === 0 ? '' :  this.props.data.likeCount}
                </span>
              </div>
              <div className={styles.replyReply}>
                <span onClick={() => this.replyClick()}>回复</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
