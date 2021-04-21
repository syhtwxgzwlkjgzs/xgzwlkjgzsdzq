import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { formatDate } from '@common/utils/format-date';

export default class ReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: this.props.data.isLiked,
      likeCount: this.props.data.likeCount,
    };
  }
  static async getInitialProps() {
    return {

    };
  }
  // 跳转至评论详情
  toCommentDetail() {
    console.log('跳至评论详情');
  }

  likeClick() {
    this.setState({
      isLiked: !this.state.isLiked,
    }, () => {
      this.setState({
        likeCount: this.state.isLiked ? this.state.likeCount + 1 : this.state.likeCount - 1,
      });
    });
    typeof this.props.likeClick === 'function' && this.props.likeClick();
  }
  replyClick() {
    typeof this.props.replyClick === 'function' && this.props.replyClick();
  }

  render() {
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
                        image={this.props.data.user.avatar}
                        name={this.props.data.user.username || this.props.data.user.userName || ''}
                        circle={true}
                        size='small'>
                      </Avatar>
                    </div>
                    <span className={styles.replyedUserName}>
                      {this.props.data.replyUser.username || this.props.data.replyUser.userName }
                    </span>
                  </div> : ''
              }
              <span onClick={() => this.props.toCommentDetail()}>{this.props.data.content}</span>
            </div>
          </div>
          <div className={styles.replyListFooter}>
            <div className={styles.replyTime}>{formatDate(this.props.data.createdAt, 'yyyy-MM-dd hh:mm')}</div>
            <div className={styles.extraBottom}>
              <div className={this.state.isLiked ? styles.replyLike : styles.replyLiked}>
                <span onClick={() => this.likeClick()}>
                  赞{this.state.likeCount === 0 ? '' : this.state.likeCount}
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
