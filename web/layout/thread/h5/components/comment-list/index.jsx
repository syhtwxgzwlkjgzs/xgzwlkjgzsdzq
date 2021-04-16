import React from 'react';
import styles from './index.module.scss';
import { Avatar } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';
import ReplyList from '../reply-list/index';

export default class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowReward: false, // 是否展示获得多少悬赏金
      isShowRedPacket: false, // 是否展示获得多少红包
      isLiked: this.props.data.isLiked,
      likeCount: this.props.data.likeCount,
      isShowOne: this.props.isShowOne,
      likeClick: this.props.likeClick(),
      replyClick: this.props.replyClick(),
      deleteClick: this.props.deleteClick(),
    };
  }
  componentDidMount() {
    // this.loadCommentList();
    this.showOne();
  }
  static async getInitialProps() {
    return {

    };
  }
  toCommentDetail() {
    console.log('跳至评论详情');
  }
  // 处理评论的回复只显示一条
  showOne() {
    console.log(this.state.isShowOne);
  }
  likeClick() {
    this.setState({
      likeCount: !this.state.isLiked ? this.state.likeCount + 1 : this.state.likeCount - 1,
      isLiked: !this.state.isLiked,
    });
    this.state.likeClick('1');
  }
  replyClick() {
    this.state.replyClick('1');
  }
  deleteClick() {
    this.state.deleteClick('1');
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
                <div className={this.state.isLiked ? styles.commentLike : styles.commentLiked}>
                    <span onClick={() => this.likeClick()}>赞{this.state.likeCount > 0 ? this.state.likeCount : ''}</span>
                </div>
                <div className={styles.commentReply}>
                  <span onClick={() => this.replyClick()}>回复</span>
                </div>
                <div className={styles.commentDelete}>
                  <span onClick={() => this.deleteClick()}>删除</span>
                </div>
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
                                            replyClick={this.props.replyClick}
                                            deleteClick={this.props.deleteClick}>
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
