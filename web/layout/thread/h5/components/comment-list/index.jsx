import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import ReplyList from '../reply-list/index';
import { diffDate } from '@common/utils/diff-date';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowReward: false, // 是否展示获得多少悬赏金
      isShowRedPacket: false, // 是否展示获得多少红包
      isShowAdopt: false, // 是否展示采纳按钮
      isHideEdit: this.props.isHideEdit, // 隐藏评论编辑删除
      isShowOne: this.props.isShowOne || false, // 是否只显示一条评论回复
      isLiked: this.props.data.isLiked,
      likeCount: this.props.data.likeCount,
    };
    this.needReply = this.props.data.lastThreeComments;// 评论的回复
    this.replyNumber = this.props.data.replyCount - 1; // 评论的回复
  }

  static async getInitialProps() {
    return {

    };
  }
  toCommentDetail = () => {
    if (this.state.isShowOne) {
      typeof this.props.onCommentClick === 'function' && this.props.onCommentClick();
    }
  }

  // 点击头像
  avatarClick() {
    typeof this.props?.avatarClick === 'function' && this.props.avatarClick();
  }

  // 点击评论赞
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

  // 点击评论回复
  replyClick() {
    typeof this.props.replyClick === 'function' && this.props.replyClick();
  }

  // 点击评论删除
  deleteClick() {
    typeof this.props.deleteClick === 'function' && this.props.deleteClick();
  }

  // 点击评论采纳
  adoptClick() {
    console.log('点击采纳');
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
    typeof this.props.replyReplyClick === 'function' && this.props.replyReplyClick(data);
  }

  reployAvatarClick(data) {
    typeof this.props.reployAvatarClick === 'function' && this.props.reployAvatarClick(data);
  }

  render() {
    return (
      <div className={styles.commentList}>
        <div className={styles.header}>
          <div className={styles.showGet}>
            {!this.state.isHideEdit
              && <div className={styles.extra}>
                <div className={styles.revise} onClick={() => this.editClick()}>编辑</div>
                <div className={styles.revise} onClick={() => this.deleteClick()}>删除</div>
              </div>
            }
            {
              this.state.isShowReward
                ? <div>
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>{6}</span>元悬赏金
                  </div>
                </div>
                : ''
            }
            {
              this.state.isShowRedPacket
                ? <div>
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>{6}</span>元红包
                  </div>
                </div>
                : ''
            }
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.commentListAvatar} onClick={() => this.avatarClick()}>
            <Avatar
              image={this.props.data.user.avatar}
              name={this.props.data.user.username || this.props.data.user.userName || ''}
              circle={true}>
            </Avatar>
          </div>
          <div className={styles.commentListContent}>
            <div className={styles.commentListContentText} onClick={() => this.toCommentDetail()}>
              <div className={styles.commentListName}>
                {this.props.data.user.username || this.props.data.user.userName}
              </div>
              <div className={styles.commentListText}>
                {this.props.data.content}
              </div>
            </div>
            <div className={styles.commentListFooter}>
              <div className={styles.commentBtn}>
                <div className={styles.commentTime}>{diffDate(this.props.data.createdAt)}</div>
                <div className={styles.extraBottom}>
                  <div className={this.state.isLiked ? styles.commentLike : styles.commentLiked}>
                    <span onClick={() => this.likeClick()}>
                      赞&nbsp;{this.state.likeCount > 0 ? this.state.likeCount : ''}
                    </span>
                  </div>
                  <div className={styles.commentReply}>
                    <span onClick={() => this.replyClick()}>回复</span>
                  </div>
                  {
                    this.state.isShowAdopt
                      ? <div className={styles.commentAdopt}>
                        <span onClick={() => this.adoptClick()}>采纳</span>
                      </div> : ''
                  }
                </div>
              </div>
              {
                this.replyNumber > 0 && this.state.isShowOne
                  ? <div
                    className={styles.moreReply}
                    onClick={() => this.toCommentDetail()}>
                    查看之前{this.replyNumber}条回复...
                    </div> : ''
              }
              {
                this.needReply?.length > 0
                && <div className={styles.replyList}>
                  {
                    this.state.isShowOne
                      ? <ReplyList
                        data={this.needReply[0]}
                        key={this.needReply[0].id}
                        avatarClick={() => this.reployAvatarClick(this.needReply[0])}
                        likeClick={() => this.replyLikeClick(this.needReply[0])}
                        replyClick={() => this.replyReplyClick(this.needReply[0])}
                        toCommentDetail={() => this.toCommentDetail()}>
                      </ReplyList>
                      : (this.needReply || [])
                        .map((val, index) => (
                          <ReplyList
                            data={val}
                            key={val.id || index}
                            avatarClick={() => this.reployAvatarClick(val)}
                            likeClick={() => this.replyLikeClick(val)}
                            replyClick={() => this.replyReplyClick(val)}
                            toCommentDetail={() => this.toCommentDetail()}>
                          </ReplyList>
                        ))
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentList;
