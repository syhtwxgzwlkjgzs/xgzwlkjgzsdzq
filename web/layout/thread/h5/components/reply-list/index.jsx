import React from 'react';
import styles from './index.module.scss';
import { Avatar } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';

export default class ReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: this.props.data.isLiked,
      likCount: this.props.data.likCount,
      likeClick: this.props.likeClick(),
      replyClick: this.props.replyClick(),
      deleteClick: this.props.deleteClick(),
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
        likCount: this.state.isLiked ? this.state.likCount + 1 : this.state.likCount - 1,
      });
    });
    this.state.likeClick('2');
  }
  replyClick() {
    this.state.replyClick('2');
  }
  deleteClick() {
    this.state.deleteClick('2');
  }

  render() {
    return (
      <div className={styles.replyList}>
        <div className={styles.replyListAvatar} onClick={this.props.avatarClick('2')}>
          <Avatar image={this.props.data.user.avatar} circle={true} size={'small'}></Avatar>
        </div>
        <div className={styles.replyListContent}>
          <div className={styles.replyListContentText}>
            <div className={styles.replyListName}>
              {this.props.data.user.username}
            </div>
            <div className={styles.replyListText}>
              {
                this.props.data.commentUserId
                  ? <div className={styles.commentUser}>
                    <div className={styles.replyedAvatar} onClick={this.props.avatarClick('3')}>
                        <Avatar image={this.props.data.user.avatar} circle={true} size={'small'}></Avatar>
                    </div>
                    <span className={styles.replyedUserName}>
                      {this.props.data.replyUser.username}
                    </span>
                  </div> : ''
              }
                <span onClick={() => this.props.toCommentDetail()}>{this.props.data.content}</span>
            </div>
          </div>
          <div className={styles.replyListFooter}>
            <div className={styles.replyTime}>{3}分钟</div>
            <div className={this.state.isLiked ? styles.replyLike : styles.replyLiked}>
              <span onClick={() => this.likeClick()}>
                赞{this.state.likCount === 0 ? '' : this.state.likCount}
              </span>
            </div>
            <div className={styles.replyReply}>
              <span onClick={() => this.replyClick('2')}>回复</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
