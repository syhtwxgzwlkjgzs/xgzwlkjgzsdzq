import React from 'react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import { Avatar } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';
import ReplyList from '../reply-list/index';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowReward: false, // 是否展示获得多少悬赏金
      isShowRedPacket: true, // 是否展示获得多少红包
      isShowAdopt: false, // 是否展示采纳按钮
      isShowOne: this.props.isShowOne || false, // 是否只显示一条评论回复
      isLiked: this.props.data.isLiked,
      likeCount: this.props.data.likeCount,
      likeClick: this.props.likeClick(),
      replyClick: this.props.replyClick(),
      deleteClick: this.props.deleteClick(),
    };
    this.needReply = this.props.data.lastThreeComments;// 评论的回复
    this.replyNumber = this.props.data.lastThreeComments.length - 1; // 评论的回复
  }
  componentDidMount() {
    // this.loadCommentList();
    this.showOne();
  }
  static async getInitialProps() {
    return {

    };
  }
  toCommentDetail = () => {
    if (this.state.isShowOne) {
      this.props.router.push('/thread/comment/1');
    }
  }
  // 处理评论的回复只显示一条
  showOne() {
    console.log('this.isShowOne', this.state.isShowOne);
    if (this.state.isShowOne) {
      this.needReply = [];
      this.needReply.push(this.props.data.lastThreeComments[0]);
    }
  }
  likeClick() {
    this.setState({
      isLiked: !this.state.isLiked,
    }, () => {
      this.setState({
        likeCount: this.state.isLiked ? this.state.likeCount + 1 : this.state.likeCount - 1,
      });
    });
    this.state.likeClick('1');
  }
  replyClick() {
    this.state.replyClick('1');
  }
  deleteClick() {
    this.state.deleteClick('1');
  }
  adoptClick() {
    console.log('点击采纳');
  }

  render() {
    return (
      <div className={styles.commentList}>
        <div className={styles.header}>
            <div className={styles.showGet}>
              <div className={styles.revise}>管理</div>
              {
                this.state.isShowReward
                  ? <div>
                      <div className={styles.showMoneyNum}>
                        获得<span className={styles.moneyNumber}>{6}</span>元悬赏金
                      </div>
                    </div> : ''
              }
              {
                this.state.isShowRedPacket
                  ? <div>
                      <div className={styles.showMoneyNum}>
                        获得<span className={styles.moneyNumber}>{6}</span>元红包
                      </div>
                    </div> : ''
              }
          </div>
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
                {
                  this.state.isShowAdopt
                    ? <div className={styles.commentAdopt}>
                        <span onClick={() => this.adoptClick()}>采纳</span>
                      </div> : ''
                }
              </div>
              {
                this.replyNumber > 0 && this.state.isShowOne
                  ? <div
                      className={styles.moreReply}
                      onClick={() => this.toCommentDetail()}>
                        查看之前{this.replyNumber}条回复...
                    </div> : ''
              }
              <div className={styles.ReplyList}>
                {
                  this.needReply
                    .map((val, index) => <ReplyList
                                            data={val}
                                            key={index}
                                            avatarClick={this.props.avatarClick}
                                            likeClick={this.props.likeClick}
                                            replyClick={this.props.replyClick}
                                            deleteClick={this.props.deleteClick}
                                            toCommentDetail={this.toCommentDetail}>
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

export default withRouter(CommentList);
