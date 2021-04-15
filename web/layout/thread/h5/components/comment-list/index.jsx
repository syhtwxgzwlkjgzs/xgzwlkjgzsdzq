import React from 'react';
import styles from './index.module.scss';
import { Avatar } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';
import ReplyList from '../reply-list/index';

export default class CommentList extends React.Component {
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
  toCommentDetail() {
    console.log('跳至评论详情');
  }

  render() {
    return (
      <div className={styles.commentList}>
        <div className={styles.commentListAvatar}>
          <Avatar image={this.props.data.user.avatar} circle={true}></Avatar>
        </div>
        <div className={styles.commentListContent}>
          <div className={styles.commentListContentText} onClick={() => this.toCommentDetail()}>
            <div className={styles.commentListName}>
              {this.props.data.user.username}
            </div>
            <div className={styles.commentListText}>
              {this.props.data.content}
            </div>
          </div>
          <div className={styles.commentListFooter}>
            <div className={styles.commentBtn}>
              <div className={styles.commentTime}>{13}分钟</div>
              <div className={styles.commentLiked} onClick={() => this.handleClik('1')}>
                赞{this.props.data.likeCount === 0 ? '' : this.props.data.likeCount}
              </div>
              <div className={styles.commentReply} onClick={() => this.handleClik('2')}>回复</div>
              <div className={styles.commentDelete} onClick={() => this.handleClik('3')}>删除</div>
            </div>
            <div className={styles.ReplyList}>
              {/* <ReplyList data={this.props.data.lastThreeComments}></ReplyList> */}
              {
                this.props.data.lastThreeComments.map((val, index) => <ReplyList data={val} key={index}></ReplyList>)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
