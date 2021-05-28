import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Avatar, Button, Icon, Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
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
  const [blocking, changeBlockStatus] = useState(false);
  const [isSameWithMe, changeIsSameWithMe] = useState(false);

  const onMouseEnterHandler = useCallback(async () => {
    if (!userId) return;
    changeIsShow(true);

    if (!userInfo || userInfo === 'padding') {
      const userInfo = await props.user.getAssignUserInfo(userId);
      changeIsSameWithMe(props?.user?.id === userId);
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

  const messagingHandler = useCallback(() => {
    const username = props?.user?.userInfo.username;
    if(username) {
      props.router.push(`/message?page=chat&username=${username}`);
    } else {
      console.error("用户名错误");
    }
  })

  const blockingHandler = useCallback(async () => {
    changeBlockStatus(true);
    try {
      if (userInfo.isDeny) {
        await props.user.undenyUser(userId);
        await props.user.setTargetUserNotBeDenied();
        userInfo.isDeny = false;
        Toast.success({
          content: '解除屏蔽成功',
          hasMask: false,
          duration: 1000,
        })
      } else {
        await props.user.denyUser(userId);
        await props.user.setTargetUserDenied();
        userInfo.isDeny = true;
        Toast.success({
          content: '屏蔽成功',
          hasMask: false,
          duration: 1000,
        })
      }
    } catch (error) {
      console.error(error);
    }
    changeBlockStatus(false);
    changeUserInfo({ ...userInfo });
  }, [userInfo])

  const btnInfo = useMemo(() => {
    const index = userInfo.follow
    if (index === 2) {
      return { text: '互关', icon: 'WithdrawOutlined', className: styles.withdraw }
    }
    if (index === 1) {
      return { text: '已关注', icon: 'CheckOutlined', className: styles.isFollow }
    }
    return { text: '关注', icon: 'PlusOutlined', className: styles.follow }
  }, [userInfo.follow])


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
      <div id="avatar-popup" className={styles.userInfoBox}>
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
          {
            !isSameWithMe &&
            <div className={styles.footer}>
              <Button
                onClick={following ? () => {} : followHandler}
                loading={following}
                className={[styles.btn, btnInfo.className]}
                type='primary'>
                  {!following && (
                    <Icon className={styles.icon} name={btnInfo.icon} size={12}/>
                  )}
                  {btnInfo.text}
              </Button>
              <Button
                onClick={messagingHandler}
                className={[styles.btn, styles.ghost]}
                type='primary' ghost>
                  <Icon className={styles.icon} name="NewsOutlined" size={12}/>发私信
              </Button>
              <Button 
                onClick={blocking ? () => {} : blockingHandler}
                loading={blocking}
                className={[styles.btn, styles.block]}
                className={`${styles.btn} ${userInfo.isDeny ? styles.blocked : styles.unblocked}`}
                type='primary'
              >
                {
                  !blocking && userInfo.isDeny && (
                    <Icon className={styles.icon} name="ShieldOutlined" size={12}/>
                  )
                }
                屏蔽
              </Button>
            </div>
          }
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
    <div className={styles.avatarBox} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
      <Avatar className={className} circle={circle} text={userName} size={size} onClick={onClick}></Avatar>
      {isShow && userInfoBox}
    </div>
  );
}
export default inject('user')(withRouter(avatar));
