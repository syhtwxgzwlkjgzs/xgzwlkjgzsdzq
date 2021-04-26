import React from 'react';
import { View, Text } from '@tarojs/components';
// import Avatar from '@components/avatar';
import styles from './index.module.scss';
import { diffDate } from '@common/utils/diff-date';
import ReplyList from '../reply-list/index';



class CommentList extends React.Component {
    
    static async getInitialProps() {
        return {
            
        };
    }
    constructor(props) {
      super(props);
      this.state = {
        isShowReward: true, // 是否展示获得多少悬赏金
        isShowRedPacket: false, // 是否展示获得多少红包
        isShowAdopt: false, // 是否展示采纳按钮
        isHideEdit: this.props.isHideEdit, // 隐藏评论编辑删除
        isShowOne: this.props.isShowOne || false, // 是否只显示一条评论回复
        isLiked: this.props.data.isLiked,
        likeCount: this.props.data.likeCount,
      };
      this.needReply = this.props.data.lastThreeComments;// 评论的回复
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
      <View className={styles.commentList}>
        <View className={styles.header}>
          <View className={styles.showGet}>
            <View>
            {!this.state.isHideEdit
              && <View className={styles.extra}>
                <View className={styles.revise} onClick={() => this.editClick()}>编辑</View>
                <View className={styles.revise} onClick={() => this.deleteClick()}>删除</View>
              </View>
            }
            </View>
            {
              this.state.isShowReward
                ? <View>
                  <View className={styles.showMoneyNum}>
                    获得<Text className={styles.moneyNumber}>{6}</Text>元悬赏金
                  </View>
                </View>
                : ''
            }
            {
              this.state.isShowRedPacket
                ? <View>
                  <View className={styles.showMoneyNum}>
                    获得<Text className={styles.moneyNumber}>{6}</Text>元红包
                  </View>
                </View>
                : ''
            }
          </View>
        </View>
        <View className={styles.content}>
          <View className={styles.commentListAvatar} onClick={() => this.avatarClick()}>
            <View className={styles.avater}>头像</View>
            {/* <Avatar
              image={this.props.data.user.avatar}
              name={this.props.data.user.username || this.props.data.user.userName || ''}
              circle>
            </Avatar> */}
          </View>
          <View className={styles.commentListContent}>
            <View className={styles.commentListContentText} onClick={() => this.toCommentDetail()}>
              <View className={styles.commentListName}>
                {this.props.data.user.username || this.props.data.user.userName}
              </View>
              <View className={styles.commentListText}>
                {this.props.data.content}
              </View>
            </View>
            <View className={styles.commentListFooter}>
              <View className={styles.commentBtn}>
                <View className={styles.commentTime}>{diffDate(this.props.data.createdAt)}</View>
                <View className={styles.extraBottom}>
                  <View className={this.state.isLiked ? styles.commentLike : styles.commentLiked}>
                    <Text onClick={() => this.likeClick()}>
                      赞&nbsp;{this.state.likeCount > 0 ? this.state.likeCount : ''}
                    </Text>
                  </View>
                  <View className={styles.commentReply}>
                    <Text onClick={() => this.replyClick()}>回复</Text>
                  </View>
                  {
                    this.state.isShowAdopt
                      ? <View className={styles.commentAdopt}>
                        <Text onClick={() => this.adoptClick()}>采纳</Text>
                      </View> : ''
                  }
                </View>
              </View>
              {
                this.props.data?.replyCount - 1 > 0 && this.state.isShowOne
                  ? <View
                    className={styles.moreReply}
                    onClick={() => this.toCommentDetail()}>
                    查看之前{this.props.data?.replyCount - 1}条回复...
                    </View> : ''
              }
              {
                this.needReply?.length > 0
                && <View className={styles.replyList}>
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
                </View>
              }
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default CommentList;
