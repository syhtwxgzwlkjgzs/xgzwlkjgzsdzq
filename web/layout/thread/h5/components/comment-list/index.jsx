import React from 'react';
import styles from './index.module.scss';
import { Avatar } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';

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
    } else {
      console.log('回复');
    }
  }
  handleLogClick = () => {
    console.log(this.props);
  }

  render() {
    return (
      <div className={styles.commentList} onClick={() => this.handleLogClick()}>
        <div className={styles.commentListAvatar}>
          <Avatar image={this.props.data.user.avatar} circle={true}></Avatar>
        </div>
        <div className={styles.commentListContent}>
          <div className={styles.commentListContentText}>
            <div className={styles.commentListName}>
              {this.props.data.user.username}
            </div>
            <div className={styles.commentListText}>
              {this.props.data.content}
            </div>
          </div>
          <div className={styles.commentListFooter}>
            <div className={styles.commentTime}>{3}分钟</div>
            <div className={styles.commentLiked} onClick={() => this.handleClik('1')}>赞</div>
            <div className={styles.commentReply} onClick={() => this.handleClik('2')}>回复</div>
          </div>
        </div>
      </div>
    );
  }
}
