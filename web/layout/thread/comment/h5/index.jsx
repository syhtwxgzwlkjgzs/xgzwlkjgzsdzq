import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import CommentList from '../../h5/components/comment-list/index';

import { Icon } from '@discuzq/design';

@inject('site')
@inject('user')
@observer
class CommentH5Page extends React.Component {
  state = {
    isShowReward: false, // 是否展示获得多少悬赏金
    isShowRedPacket: true, // 是否展示获得多少红包
    commentData: {
      id: 3,
      userId: 1,
      threadId: 2,
      replyPostId: null,
      replyUserId: null,
      commentPostId: null,
      commentUserId: null,
      content: '1',
      contentHtml: '<p>1</p>',
      replyCount: 4,
      likeCount: 2,
      createdAt: '2021-01-12 15:58:36',
      updatedAt: '2021-02-12 14:01:23',
      isFirst: false,
      isComment: false,
      isApproved: 1,
      rewards: 0,
      canApprove: false,
      canDelete: false,
      canHide: false,
      canEdit: false,
      user: {
        id: 1,
        username: 'admin',
        avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
        realname: '',
        groups: [
          {
            id: 1,
            name: '管理员',
            isDisplay: false,
          },
        ],
        isReal: false,
      },
      images: [
        {
          id: 1,
          order: 0,
          type: 1,
          type_id: 3,
          isRemote: false,
          isApproved: 1,
          url: 'http://dzqfn.l.com/storage/attachments/2021/03/01/smmtFw27HmhpLszqQLBLsHKDWMEk3BCru03MFn1I.jpg',
          attachment: 'smmtFw27HmhpLszqQLBLsHKDWMEk3BCru03MFn1I.jpg',
          extension: 'jpg',
          fileName: 'wallhaven-0jq7pq.jpg',
          filePath: 'public/attachments/2021/03/01/',
          fileSize: 481902,
          fileType: 'image/jpeg',
          thumbUrl: 'http://dzqfn.l.com/storage/attachments/2021/03/01/smmtFw27HmhpLszqQLBLsHKDWMEk3BCru03MFn1I.jpg',
        },
      ],
      likeState: {
        post_id: 3,
        user_id: 2,
        created_at: '2021-03-15T09:25:09.000000Z',
      },
      canLike: true,
      summary: '<p>1</p>',
      summaryText: '1',
      isDeleted: false,
      redPacketAmount: 0,
      isLiked: true,
      likedAt: '2021-03-15 17:25:09',
      lastThreeComments: [
        {
          id: 20,
          userId: 1,
          threadId: 2,
          replyPostId: 3,
          replyUserId: 1,
          commentPostId: null,
          commentUserId: null,
          content: '1-回复4',
          contentHtml: '<p>1-回复4</p>',
          replyCount: 0,
          likCount: 0,
          createdAt: '2021-02-24 17:38:27',
          updatedAt: '2021-02-12 14:01:23',
          isFirst: false,
          isComment: true,
          isApproved: 1,
          rewards: 0,
          canApprove: false,
          canDelete: false,
          canHide: false,
          canEdit: false,
          user: {
            id: 1,
            username: 'admin',
            avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
            realname: '',
            isReal: false,
          },
          images: [],
          likeState: null,
          canLike: true,
          summary: '<p>1-回复4</p>',
          summaryText: '1-回复4',
          isDeleted: false,
          replyUser: {
            id: 1,
            username: 'admin',
            avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
            realname: '',
            isReal: false,
          },
          isLiked: false,
          commentUser: null,
        },
        {
          id: 19,
          userId: 1,
          threadId: 2,
          replyPostId: 3,
          replyUserId: 1,
          commentPostId: null,
          commentUserId: null,
          content: '1-回复3',
          contentHtml: '<p>1-回复3</p>',
          replyCount: 0,
          likeCount: 0,
          createdAt: '2021-02-24 17:38:22',
          updatedAt: '2021-02-12 14:01:23',
          isFirst: false,
          isComment: true,
          isApproved: 1,
          rewards: 0,
          canApprove: false,
          canDelete: false,
          canHide: false,
          canEdit: false,
          user: {
            id: 1,
            username: 'admin',
            avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
            realname: '',
            isReal: false,
          },
          images: [],
          likeState: null,
          canLike: true,
          summary: '<p>1-回复3</p>',
          summaryText: '1-回复3',
          isDeleted: false,
          replyUser: {
            id: 1,
            username: 'admin',
            avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
            realname: '',
            isReal: false,
          },
          isLiked: false,
          commentUser: null,
        },
        {
          id: 20,
          userId: 1,
          threadId: 2,
          replyPostId: 3,
          replyUserId: 1,
          commentPostId: null,
          commentUserId: null,
          content: '1-回复4',
          contentHtml: '<p>1-回复4</p>',
          replyCount: 0,
          likCount: 0,
          createdAt: '2021-02-24 17:38:27',
          updatedAt: '2021-02-12 14:01:23',
          isFirst: false,
          isComment: true,
          isApproved: 1,
          rewards: 0,
          canApprove: false,
          canDelete: false,
          canHide: false,
          canEdit: false,
          user: {
            id: 1,
            username: 'admin',
            avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
            realname: '',
            isReal: false,
          },
          images: [],
          likeState: null,
          canLike: true,
          summary: '<p>1-回复4</p>',
          summaryText: '1-回复4',
          isDeleted: false,
          replyUser: {
            id: 1,
            username: 'admin',
            avatar: 'http://dzqfn.l.com/storage/avatars/000/00/00/01.png?1617019550',
            realname: '',
            isReal: false,
          },
          isLiked: false,
          commentUser: null,
        },
      ],
    },
  }
  // 点击更多
  onMoreClick() {
    console.log('点击了更多');
  }
  render() {
    return (
      <div className={styles.index}>
        <div className={styles.header}>
          <div className={styles.show}>
            {
              this.state.isShowReward
                ? <div className={styles.showGet}>
                    <div className={styles.icon}>悬赏图标</div>
                    <div className={styles.showMoneyNum}>
                      获得<span className={styles.moneyNumber}>5.20</span>元悬赏金
                    </div>
                  </div> : ''
            }
            {
              this.state.isShowRedPacket
                ? <div className={styles.showGet}>
                    <div className={styles.icon}>红包图标</div>
                    <div className={styles.showMoneyNum}>
                      获得<span className={styles.moneyNumber}>5.20</span>元红包
                    </div>
                  </div> : ''
            }
          </div>
          {/* 先用这个icon暂代 */}
          <Icon
            onClick={() => this.onMoreClick()}
            className={styles.more}
            size='20'
            name='ShareAltOutlined'>
          </Icon>
        </div>
        <div className={styles.content}>
          <CommentList data={this.state.commentData}></CommentList>
        </div>
      </div>
    );
  }
}

export default withRouter(CommentH5Page);

