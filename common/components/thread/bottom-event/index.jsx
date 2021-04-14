import React from 'react';
import style from './Index.module.scss';
import Tip from '../tip';

/**
 * 帖子底部内容
 * @prop {array}    userImas 点赞分享用户信息
 * @prop {number}    wholeNum 全部人数
 * @prop {number}    comment 评论人数
 * @prop {number}    sharing 分享人数
 */
const Index = ({ userImas = {}, wholeNum = 11, comment = 1, sharing = 0, datas = [] }) => <div className={style.user}>
    <div className={style.userImg}>
      <dev className={style.portrait}>
        <Tip imgs={datas}></Tip>
      </dev>
      <p className={style.numText}>
        {wholeNum}
      </p>
    </div>
    <div className={style.commentSharing}>
      {comment > 0 && <p className={style.commentNum}>{`${comment}条评论`}</p>}
      {comment > 0 && sharing > 0 && <p className={style.division}>·</p>}
      {sharing > 0 && <p className={style.commentNum}>{`${sharing}次分享`}</p>}
    </div>
  </div>;
export default React.memo(Index);
