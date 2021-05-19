import React, { useMemo } from 'react';
import styles from './index.module.scss';
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
  isLiked = false,
  isSendingLike = false,
  tipData,
  platform,
  onShare = () => {},
  onComment = () => {},
  onPraise = () => {},
}) => {
  const postList = useMemo(() => {
    const praise =  {
      icon: 'LikeOutlined',
      name: '赞',
      event: onPraise,
      type: 'like'
    };

    return [praise, {
      icon: 'MessageOutlined',
      name: '评论',
      event: onComment,
      type: 'commonet'
    },
    {
      icon: 'ShareAltOutlined',
      name: '分享',
      event: onShare,
      type: 'share'
    }];
  }, [isLiked]);

  const needHeight = useMemo(() => {
    return userImgs.length !== 0 || comment > 0 || sharing > 0
  }, [userImgs, comment, sharing])
  return (
    <div>
      <div className={needHeight ? styles.user : styles.users}>
        {userImgs.length !== 0 ? <div className={styles.userImg}>
          <div className={styles.portrait}>
            <Tip tipData={tipData} imgs={userImgs} wholeNum={wholeNum}></Tip>
          </div>
          {
            wholeNum !== 0 && (
              <p className={styles.numText}>
                {wholeNum}
              </p>
            )
          }
        </div> : <div></div>}
        <div className={styles.commentSharing}>
          {comment > 0 && <p className={styles.commentNum}>{`${comment}条评论`}</p>}
          {comment > 0 && sharing > 0 && <p className={styles.division}>·</p>}
          {sharing > 0 && <p className={styles.commentNum}>{`${sharing}次分享`}</p>}
        </div>
      </div>

      <div className={needHeight ? styles.operation : styles.operations}>
        {
          postList.map((item, index) => (
              <div key={index} className={styles.fabulous} onClick={item.event}>
                <Icon 
                  className={`${styles.icon} ${item.type} ${isLiked && item.name === '赞' ? styles.likedColor : styles.dislikedColor}`} 
                  name={item.icon} 
                  size={16}>  
                </Icon>
                <span className={isLiked && item.name ===  '赞' ? styles.fabulousCancel: styles.fabulousPost}>
                  {item.name}
                </span>
              </div>
          ))
        }
      </div>
    </div>
  );
};
export default React.memo(Index);
