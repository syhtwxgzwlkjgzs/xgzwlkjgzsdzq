import React from 'react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import { Avatar, Icon, Toast } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';
import ReplyList from '../reply-list/index';
import Input from '../input/index';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowInput: false, // 是否显示input框
      isShowReward: false, // 是否展示获得多少悬赏金
      isShowRedPacket: true, // 是否展示获得多少红包
      isShowAdopt: true, // 是否展示采纳按钮
      isPostDetail: this.props.isPostDetail || false, // 是否只显示一条评论回复
      isLiked: this.props.data.isLiked,
      likeCount: this.props.data.likeCount,
    };
    this.needReply = this.props.data.lastThreeComments;// 评论的回复
    this.replyNumber = this.props.data.replyCount - 1; // 评论的回复
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
    if (this.state.isPostDetail && this.props?.data?.id) {
      this.props.router.push(`/thread/comment/${this.props?.data?.id}`);
    }
  }
  // 处理评论的回复只显示一条
  showOne() {
    console.log('this.isPostDetail', this.state.isPostDetail);
    if (this.state.isPostDetail) {
      this.needReply = [];
      this.props.data?.lastThreeComments?.length && this.needReply.push(this.props.data.lastThreeComments[0]);
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
    this.props.likeClick(this.props.data);
  }
  replyClick() {
    this.props.replyClick(this.props.data);
    this.setState({ isShowInput: !this.state.isShowInput });
  }
  // deleteClick() {
  //   this.props.deleteClick('1');
  // }
  adoptClick() {
    console.log('点击采纳');
  }
  // 返回上一页
  onBackClick = () => {
    Toast.success({
      content: '返回上一页',
    });
  }
  // createReply(val) {
  //   this.state.createReply(val);
  // }

  // onPublishClick(val) {
  //   this.props.createReply(val);
  // }

  render() {
    const { likeClick, replyClick, deleteClick, createReply, avatarClick } = this.props;

    return (
      <div className={styles.commentList}>
        <div className={styles.header}>
          {
            this.state.isPostDetail ? <div></div>
              : <div className={styles.back} onClick={this.onBackClick}>
                <Icon
                  name='WarnOutlined'
                  size='16'
                  className={styles.backIcon}>
                </Icon>
                <span>返回</span>
              </div>
          }
          <div className={`${styles.showGet} ${this.state.isPostDetail ? '' : styles.padding}`}>
            <div className={styles.extra}>
              {/* <div className={styles.revise}>编辑</div> */}
            </div>
            {
              this.state.isPostDetail
                ? <div className={styles.delete}>
                  <Icon
                    name='WarnOutlined'
                    size='16'
                    className={styles.deleteIcon}>
                  </Icon>
                  <span onClick={() => deleteClick(this.props.data.id)}>删除</span>
                </div> : ''
            }
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
            {
              this.state.isPostDetail
                ? '' : <div className={styles.delete}>
                  <Icon
                    name='WarnOutlined'
                    size='16'
                    className={styles.deleteIcon}>
                  </Icon>
                  <span onClick={() => deleteClick(this.props.data.id)}>删除</span>
                </div>
            }
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.commentListAvatar} onClick={() => avatarClick('1')}>
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
              {
                this.state.isPostDetail
                  ? <div className={styles.commentBtn}>
                    <div className={styles.commentTime}>{this.props.data.createdAt.split(' ')[1]}</div>
                    <div className={styles.extraBottom}>
                      <div className={this.state.isLiked ? styles.commentLike : styles.commentLiked}>
                        <Icon
                          name='LikeOutlined'
                          size='16'
                          className={styles.btnIcon}>
                        </Icon>
                        <span onClick={() => this.likeClick()}>赞{this.state.likeCount > 0 ? this.state.likeCount : ''}</span>
                      </div>
                      <div className={styles.commentReply}>
                        <Icon
                          name='MessageOutlined'
                          size='16'
                          className={styles.btnIcon}>
                        </Icon>
                        <span onClick={() => this.replyClick()}>回复</span>
                      </div>
                      {
                        this.state.isShowAdopt
                          ? <div className={styles.commentAdopt}>
                            <Icon
                              name='WarnOutlined'
                              size='16'
                              className={styles.btnIcon}>
                            </Icon>
                            <span onClick={() => this.adoptClick()}>采纳</span>
                          </div> : ''
                      }
                      <div className={styles.commentReply}>
                        <Icon
                          name='WarnOutlined'
                          size='16'
                          className={styles.btnIcon}>
                        </Icon>
                        <span onClick={() => replyClick(this.props.data)}>举报</span>
                      </div>
                    </div>
                  </div>
                  : <div className={styles.line}></div>
              }
              {
                this.state.isShowInput ? <div className={styles.input}>
                  <Input onSubmit={createReply} height='label' />
                </div> : ''
              }
              {
                this.replyNumber > 0 && this.state.isPostDetail
                  ? <div
                    className={styles.moreReply}
                    onClick={() => this.toCommentDetail()}>
                    查看之前{this.replyNumber}条回复...
                    </div> : ''
              }
              <div className={styles.ReplyList}>
                {
                  this.needReply.map((val, index) => (
                    <ReplyList
                      data={val}
                      key={index}
                      avatarClick={type => avatarClick(type)}
                      likeClick={data => likeClick(data)}
                      replyClick={data => replyClick(data)}
                      deleteClick={data => deleteClick(data)}
                      toCommentDetail={this.toCommentDetail}
                      createReply={createReply}
                      isPostDetail={this.state.isPostDetail}>
                    </ReplyList>
                  ))
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
