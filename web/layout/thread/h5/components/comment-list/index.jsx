import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { Icon } from '@discuzq/design';
import ReplyList from '../reply-list/index';
import { diffDate } from '@common/utils/diff-date';
import { observer } from 'mobx-react';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import ImageDisplay from '@components/thread/image-display';

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
      canHide: data.canLike || false,
      canLike: data.canLike || false,
    };
  }

  render() {
    const { canDelete, canEdit, canLike } = this.generatePermissions(this.props.data);

    return (
      <div className={styles.commentList}>
        <div className={styles.header}>
          <div className={styles.showGet}>
            <div></div>
            <div className={styles.headerRigth}>
              {this.props.data?.rewards ? (
                <div className={styles.imageNumber}>
                  <img className={styles.rewardImage} src="/dzq-img/coin.png" alt="悬赏图标" />
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>{this.props.data.rewards}</span>元悬赏金
                  </div>
                </div>
              ) : (
                ''
              )}
              {this.props.data?.redPacketAmount ? (
                <div className={`${styles.redpacket} ${styles.imageNumber}`}>
                  <img className={styles.image} src="/dzq-img/redpacket-mini.png" alt="红包图标" />
                  <div className={styles.showMoneyNum}>
                    获得<span className={styles.moneyNumber}>{this.props.data.redPacketAmount}</span>元红包
                  </div>
                </div>
              ) : (
                ''
              )}
              {!this.state.isShowOne ? (
                <div className={styles.more} onClick={this.props.onMoreClick}>
                  <Icon size={20} color="#8590A6" name="MoreVOutlined" className={styles.moreIcon}></Icon>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.commentListAvatar} onClick={() => this.avatarClick()}>
            <Avatar
              image={this.props.data?.user?.avatar}
              name={this.props.data?.user?.nickname || this.props.data?.user?.userName || ''}
              circle={true}
            ></Avatar>
          </div>

          <div className={styles.commentListContent}>
            <div className={styles.commentListContentText} onClick={() => this.toCommentDetail()}>
              <div className={styles.commentListName}>
                {this.props.data?.user?.nickname || this.props.data?.user?.userName || '用户异常，请联系管理员'}
              </div>
              <div className={styles.commentListText} dangerouslySetInnerHTML={{ __html: this.filterContent() }}></div>
              {/* 图片展示 */}
              {this.props.data?.images && (
                <div className={styles.imageDisplay}>
                  <ImageDisplay platform="h5" imgData={this.props.data?.images} />
                </div>
              )}
            </div>
            {this.props.data?.user && (
              <div className={styles.commentListFooter}>
                <div className={styles.commentBtn}>
                  <div className={styles.commentTime}>{diffDate(this.props.data.createdAt)}</div>
                  <div className={styles.extraBottom}>
                    <div className={this.props?.data?.isLiked ? styles.commentLike : styles.commentLiked}>
                      <span onClick={() => this.likeClick(canLike)}>
                        赞&nbsp;{this.props?.data?.likeCount > 0 ? this.props.data.likeCount : ''}
                      </span>
                    </div>
                    <div className={styles.commentReply}>
                      <span onClick={() => this.replyClick()}>回复</span>
                    </div>
                    {this.props.isShowAdopt && (
                      <div className={styles.commentAdopt}>
                        <span onClick={() => this.props.onAboptClick()}>采纳</span>
                      </div>
                    )}
                    {!this.state.isHideEdit && canDelete && (
                      <div className={styles.extra}>
                        {/* {canEdit && <div className={styles.revise} onClick={() => this.editClick()}>编辑</div>} */}
                        {canDelete && (
                          <div className={styles.revise} onClick={() => this.deleteClick()}>
                            删除
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {this.props.data?.replyCount - 1 > 0 && this.state.isShowOne ? (
                  <div className={styles.moreReply} onClick={() => this.toCommentDetail()}>
                    查看之前{this.props.data?.replyCount - 1}条回复...
                  </div>
                ) : (
                  ''
                )}
                {this.needReply?.length > 0 && (
                  <div className={styles.replyList}>
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CommentList;
