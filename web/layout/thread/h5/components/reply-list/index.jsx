import React from 'react';
import styles from './index.module.scss';
import { Avatar } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';

export default class ReplyList extends React.Component {
  static async getInitialProps() {
    return {

    };
  }
  // 点赞和回复
  handleClik = (type) => {
    console.log(type);
    if (type === '1') {
      console.log('点赞');
    } else if (type === '2') {
      console.log('回复');
    } else {
      console.log('删除');
    }
  }
  // 跳转至评论详情
  toCommentDetail() {
    console.log('跳至评论详情');
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
                <div className={styles.replyedAvatar} onClick={this.props.avatarClick('3')}>
                    <Avatar image={this.props.data.user.avatar} circle={true} size={'small'}></Avatar>
                </div>
                <span className={styles.replyedUserName}>
                  {this.props.data.replyUser.username}
                </span>
                <span onClick={() => this.toCommentDetail()}>{this.props.data.content}</span>
            </div>
          </div>
          <div className={styles.replyListFooter}>
            <div className={styles.replyTime}>{3}分钟</div>
            <div className={styles.replyLiked} onClick={this.props.avatarClick('2')}>
                赞{this.props.data.likeCount === 0 ? '' : this.props.data.likeCount}
            </div>
            <div className={styles.replyReply} onClick={this.props.replyClick('2')}>回复</div>
            <div className={styles.replyDelete} onClick={() => this.handleClik('3')}>删除</div>
          </div>
        </div>
      </div>
    );
  }
}
