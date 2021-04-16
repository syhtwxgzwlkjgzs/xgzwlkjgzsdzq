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
  state = {
    isShowReward: false, // 是否展示获得多少悬赏金
    isShowRedPacket: false, // 是否展示获得多少红包
  }
  // 点赞和回复
  handleClik = (type) => {
    if (type === '1') {
      this.props.avatarClick('1');
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
        <div className={styles.header}>
          {
            this.state.isShowReward
              ? <div className={styles.showGet}>
                  <div className={styles.icon}>图标</div>
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>{6}</span>元悬赏金
                  </div>
                </div> : ''
          }
          {
            this.state.isShowRedPacket
              ? <div className={styles.showGet}>
                  <div className={styles.icon}>图标</div>
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>{6}</span>元红包
                  </div>
                </div> : ''
          }
        </div>
        <div className={styles.content}>
          <div className={styles.commentListAvatar} onClick={this.props.avatarClick('1')}>
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
                <div className={styles.commentLiked} onClick={this.props.avatarClick('1')}>
                  赞{this.props.data.likeCount === 0 ? '' : this.props.data.likeCount}
                </div>
                <div className={styles.commentReply} onClick={this.props.replyClick('1')}>回复</div>
                <div className={styles.commentDelete} onClick={() => this.handleClik('3')}>删除</div>
              </div>
              <div className={styles.ReplyList}>
                {/* <ReplyList data={this.props.data.lastThreeComments}></ReplyList> */}
                {
                  this.props.data.lastThreeComments
                    .map((val, index) => <ReplyList
                                            data={val}
                                            key={index}
                                            avatarClick={this.props.avatarClick}
                                            likeClick={this.props.likeClick}
                                            replyClick={this.props.replyClick}>
                                          </ReplyList>)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
