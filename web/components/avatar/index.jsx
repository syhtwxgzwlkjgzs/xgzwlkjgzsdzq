import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Avatar, Button, Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import LoadingBox from '@components/loading-box';
import styles from './index.module.scss';

function avatar(props) {
  const { image = '', name = '匿', onClick = () => {}, className = '', circle = true, size = 'primary', isShowUserInfo = false, userId = null } = props;

  const userName = useMemo(() => {
    const newName = (name || '').toLocaleUpperCase()[0];
    return newName;
  }, [name]);

  const [isShow, changeIsShow] = useState(false);
  const [userInfo, changeUserInfo] = useState('padding');
  const [following, changeFollowStatus] = useState(false);

  const onMouseEnterHandler = useCallback(async () => {
    if (!userId) return;
    changeIsShow(true);

    if (!userInfo || userInfo === 'padding') {
      const userInfo = await props.user.getAssignUserInfo(userId);
      changeUserInfo(userInfo);
    }
  });

  const onMouseLeaveHandler = useCallback(() => {
    if (!userId) return;
    changeIsShow(false);
  });

  const followHandler = useCallback(async () => {
    changeFollowStatus(true);
    if (userInfo.follow === 0) {
      const res = await props.user.postFollow(userId);
      if (res.success) {
        userInfo.follow = res.data.isMutual ? 2 : 1;
        userInfo.fansCount = userInfo.fansCount + 1;
      }
    } else {
      const res = await props.user.cancelFollow({ id: userId, type: 1 });
      if (res.success) {
        userInfo.follow = 0;
        userInfo.fansCount = userInfo.fansCount - 1;
      }
    }
    changeFollowStatus(false);
    changeUserInfo({ ...userInfo });
  }, [userInfo]);


  const userInfoBox = useMemo(() => {
    if (!isShowUserInfo || !userId) return null;

    if (userInfo === 'padding') {
      return (
        <div className={styles.userInfoBox}>
          <div className={styles.userInfoContent}>
            <LoadingBox style={{ minHeight: '100%' }}/>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.userInfoBox}>
        <div className={styles.userInfoContent}>
          <div className={styles.header}>
            <div className={styles.left}>
              <Avatar className={styles.customAvatar} circle={true} image={userInfo.avatarUrl} siz='primary'></Avatar>
            </div>
            <div className={styles.right}>
              <p className={styles.name}>{userInfo.username}</p>
              <p className={styles.text}>{userInfo.signature && userInfo.signature !== '' ? userInfo.signature : '暂无签名'}</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.item}>
              <p className={styles.title}>主题</p>
              <p className={styles.text}>{userInfo.threadCount || 0}</p>
            </div>
            <div className={styles.item}>
              <p className={styles.title}>点赞</p>
              <p className={styles.text}>{userInfo.likedCount || 0}</p>
            </div>
            <div className={styles.item}>
              <p className={styles.title}>已关注</p>
              <p className={styles.text}>{userInfo.followCount || 0}</p>
            </div>
            <div className={styles.item}>
              <p className={styles.title}>粉丝</p>
              <p className={styles.text}>{userInfo.fansCount || 0}</p>
            </div>
          </div>
          <div className={styles.footer}>
            <Button onClick={following ? () => {} : followHandler} loading={following} className={styles.btn} type='primary'>{!following && <Icon className={styles.icon} name={ userInfo.follow !== 0 ? 'CheckOutlined' : 'PlusOutlined'} size={12}/>}{userInfo.follow ? '已关注' : '关注'}</Button>
            <Button className={[styles.btn, styles.ghost]} type='primary' ghost><Icon className={styles.icon} name="NewsOutlined" size={12}/>发私信</Button>
            <Button className={styles.btn} type='primary'><Icon className={styles.icon} name="ShieldOutlined" size={12}/>屏蔽</Button>
          </div>
        </div>
      </div>
    );
  }, [userInfo, isShowUserInfo, userId]);


  if (image && image !== '') {
    return (
      <div className={styles.avatarBox} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
        <Avatar className={className} circle={circle} image={image} size={size} onClick={onClick}></Avatar>
        {isShow && userInfoBox}
      </div>
    );
  }

  return (
    <div className={styles.avatarBox}>
      <Avatar className={className} circle={circle} text={userName} size={size} onClick={onClick}></Avatar>
      {isShow && userInfoBox}
    </div>
  );
}
export default inject('user')(avatar);
