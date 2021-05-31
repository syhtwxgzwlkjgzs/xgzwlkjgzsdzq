import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import Icon from '@discuzq/design/dist/components/icon/index';
import { View, Text, Image } from '@tarojs/components';
import ReplyList from '../reply-list/index';
import { diffDate } from '@common/utils/diff-date';
import { observer } from 'mobx-react';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import classNames from 'classnames';
import ImageDisplay from '@components/thread/image-display';

import redPacketMini from '../../../../../../web/public/dzq-img/redpacket-mini.png';
import coin from '../../../../../../web/public/dzq-img/coin.png';
@observer
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHideEdit: this.props.isHideEdit, // 隐藏评论编辑删除
      isShowOne: this.props.isShowOne || false, // 是否只显示一条评论回复
    };
    this.needReply = this.props.data.lastThreeComments; // 评论的回复
  }

  toCommentDetail = () => {
    if (this.state.isShowOne) {
      typeof this.props.onCommentClick === 'function' && this.props.onCommentClick();
    }
  };

  filterContent() {
    let newContent = this.props?.data?.content || '';
    newContent = s9e.parse(newContent);
    newContent = xss(newContent);

    return newContent;
  }

  // 点击头像
  avatarClick() {
    typeof this.props?.avatarClick === 'function' && this.props.avatarClick();
  }

  // 点击评论赞
  likeClick() {
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

  generatePermissions(data = {}) {
    return {
      canApprove: data.canApprove || false,
      canDelete: data.canDelete || false,
      canEdit: data.canEdit || false,
      canHide: data.canHide || false,
      canLike: data.canLike || false,
    };
  }

  render() {
    const { canDelete, canEdit, canLike, canHide } = this.generatePermissions(this.props.data);

    return (
      <View className={styles.commentList}>
        <View className={styles.header}>
          <View className={styles.showGet}>
            <View></View>
            <View className={styles.headerRigth}>
              {this.props.data?.rewards ? (
                <View className={styles.imageNumber}>
                  <Image className={styles.rewardImage} src={coin} alt="悬赏图标" />
                  <View className={styles.showMoneyNum}>
                    获得<Text className={styles.moneyNumber}>{this.props.data.rewards}</Text>元悬赏金
                  </View>
                </View>
              ) : (
                ''
              )}
              {this.props.data?.redPacketAmount ? (
                <View className={`${styles.redpacket} ${styles.imageNumber}`}>
                  <Image className={styles.image} src={redPacketMini} alt="红包图标" />
                  <View className={styles.showMoneyNum}>
                    获得<Text className={styles.moneyNumber}>{this.props.data.redPacketAmount}</Text>元红包
                  </View>
                </View>
              ) : (
                ''
              )}
              {!this.state.isShowOne ? (
                <View className={styles.more} onClick={this.props.onMoreClick}>
                  <Icon size={20} color="#8590A6" name="MoreVOutlined" className={styles.moreIcon}></Icon>
                </View>
              ) : (
                ''
              )}
            </View>
          </View>
        </View>
        <View className={styles.content}>
          {/* 评论用户头像 */}
          <View className={styles.commentListAvatar} onClick={() => this.avatarClick()}>
            <Avatar
              image={this.props?.data?.user?.avatar}
              name={this.props.data?.user?.nickname || this.props.data?.user?.userName || ''}
              circle={true}
            ></Avatar>
          </View>
          <View className={styles.commentListContent}>
            <View className={styles.commentListContentText} onClick={() => this.toCommentDetail()}>
              <View className={styles.commentListName}>
                {this.props.data?.user?.nickname || this.props.data?.user?.userName || '未知用户'}
              </View>
              {/* 评论内容 */}
              <View
                className={classNames(styles.commentListText, this.state.isShowOne && styles.isShowOne)}
                dangerouslySetInnerHTML={{ __html: this.filterContent() }}
              ></View>
              {/* 图片展示 */}
              {this.props.data?.images && (
                <View className={styles.imageDisplay}>
                  <ImageDisplay platform="h5" imgData={this.props.data?.images} />
                </View>
              )}
            </View>
            {/* 底部操作栏 */}
            {this.props.data?.user && (
              <View className={styles.commentListFooter}>
                <View className={styles.commentBtn}>
                  <View className={styles.commentTime}>{diffDate(this.props.data.createdAt)}</View>
                  <View className={styles.extraBottom}>
                    <View className={this.props?.data?.isLiked ? styles.commentLike : styles.commentLiked}>
                      <Text onClick={() => this.likeClick(canLike)}>
                        赞&nbsp;{this.props?.data?.likeCount > 0 ? this.props.data.likeCount : ''}
                      </Text>
                    </View>
                    <View className={styles.commentReply}>
                      <Text onClick={() => this.replyClick()}>回复</Text>
                    </View>
                    {this.props.isShowAdopt && (
                      <View className={styles.commentAdopt}>
                        <Text onClick={() => this.props.onAboptClick()}>采纳</Text>
                      </View>
                    )}
                    {!this.state.isHideEdit && canHide && (
                      <View className={styles.extra}>
                        {/* {canEdit && <View className={styles.revise} onClick={() => this.editClick()}>编辑</View>} */}
                        {canHide && (
                          <View className={styles.revise} onClick={() => this.deleteClick()}>
                            删除
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
                {this.props.data?.replyCount - 1 > 0 && this.state.isShowOne ? (
                  <View className={styles.moreReply} onClick={() => this.toCommentDetail()}>
                    查看之前{this.props.data?.replyCount - 1}条回复...
                  </View>
                ) : (
                  ''
                )}
                {this.needReply?.length > 0 && (
                  <View className={styles.replyList}>
                    {this.state.isShowOne ? (
                      <ReplyList
                        data={this.needReply[0]}
                        key={this.needReply[0].id}
                        isShowOne={true}
                        avatarClick={() => this.reployAvatarClick(this.needReply[0])}
                        likeClick={() => this.replyLikeClick(this.needReply[0])}
                        replyClick={() => this.replyReplyClick(this.needReply[0])}
                        toCommentDetail={() => this.toCommentDetail()}
                      ></ReplyList>
                    ) : (
                      (this.needReply || []).map((val, index) => (
                        <ReplyList
                          data={val}
                          key={val.id || index}
                          avatarClick={() => this.reployAvatarClick(val)}
                          likeClick={() => this.replyLikeClick(val)}
                          replyClick={() => this.replyReplyClick(val)}
                          toCommentDetail={() => this.toCommentDetail()}
                        ></ReplyList>
                      ))
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default CommentList;
