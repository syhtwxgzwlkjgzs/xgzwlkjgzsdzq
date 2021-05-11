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
  tipData,
  onShare = () => {},
  onComment = () => {},
  onPraise = () => {},
}) => {
  const postList = useMemo(() => {
    const praise =  {
      icon: 'LikeOutlined',
      name: !isLiked ? '赞' : '取消',
      event: onPraise,
    };

    return [praise, {
      icon: 'MessageOutlined',
      name: '评论',
      event: onComment,
    },
    {
      icon: 'ShareAltOutlined',
      name: '分享',
      event: onShare,
    }];
  }, [isLiked]);

  return (
    <div>
      <div className={styles.user}>
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


      <div className={styles.operation}>
        {
          postList.map((item, index) => (
              <div key={index} className={styles.fabulous} onClick={item.event}>
                <Icon className={styles.icon} name={item.icon} size={14} color={`${item.name === '取消' ? '#2469f6' : '#8590A6'}`}></Icon>
                <span className={ item.name === '取消' ? styles.fabulousCancel: styles.fabulousPost}>{item.name}</span>
              </div>
          ))
        }
      </div>
    </div>
  );
};
export default React.memo(Index);
