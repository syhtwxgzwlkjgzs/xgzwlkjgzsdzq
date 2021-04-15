import React from 'react';
import styles from './Index.module.scss';
import Tip from '../tip';
import { Icon } from '@discuzq/design';

/**
 * 帖子底部内容
 * @prop {array}    userImgs 点赞分享用户信息
 * @prop {number}    wholeNum 全部人数
 * @prop {number}    comment 评论人数
 * @prop {number}    sharing 分享人数
 * @prop {number}    onShare 分享事件
 * @prop {number}    onComment 评论事件
 * @prop {number}    onPraise 点赞事件
 */
const Index = ({
  userImgs = [],
  wholeNum = 0,
  comment = 0,
  sharing = 0,
  onShare = () => {},
  onComment = () => {},
  onPraise = () => {},
}) => {
  const postList = [
    {
      icom: 'LikeOutlined',
      name: '赞',
      event: onPraise,
    },
    {
      icon: 'MessageOutlined',
      name: '评论',
      event: onComment,
    },
    {
      icon: 'ShareAltOutlined',
      name: '分享',
      event: onShare,
    },
  ];

  return (
    <div >
      <div className={styles.user}>
      <div className={styles.userImg}>
        <div className={styles.portrait}>
          <Tip imgs={userImgs}></Tip>
        </div>
        <p className={styles.numText}>
          {wholeNum}
        </p>
      </div>
      <div className={styles.commentSharing}>
        {comment > 0 && <p className={styles.commentNum}>{`${comment}条评论`}</p>}
        {comment > 0 && sharing > 0 && <p className={styles.division}>·</p>}
        {sharing > 0 && <p className={styles.commentNum}>{`${sharing}次分享`}</p>}
      </div>
      </div>


      <div className={styles.operation}>
        {
          postList.map((item, index) => (
              <div key={index} className={styles.fabulous} onClick={item.event}>
                <Icon className={styles.icon} name={item.icon} size={14}></Icon>
                <span className={styles.fabulousPost}>{item.name}</span>
              </div>
          ))
        }
      </div>
    </div>
  );
};
export default React.memo(Index);
