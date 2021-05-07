import React, { useCallback, useMemo, useState } from 'react';
import { Avatar, Button, Icon } from '@discuzq/design';
import styles from './index.module.scss';

export default function avatar(props) {
  const { image = '', name = '匿', onClick = () => {}, className = '', circle = true, size = 'primary', isShowUserInfo = false, userId = null } = props;

  const userName = useMemo(() => {
    const newName = name.toLocaleUpperCase()[0];
    return newName;
  }, [name]);

  const [ isShow, changeIsShow ] = useState(false);

  const onMouseEnterHandler = useCallback(() => {
    changeIsShow(true);
  })

  const onMouseLeaveHandler = useCallback(() => {
    changeIsShow(false);
  })

  const userInfoBox = useMemo(() => {
    if (!isShowUserInfo || !userId) return null;
    return (
      <div className={styles.userInfoBox}>
        <div className={styles.userInfoContent}>
          <div className={styles.header}>
            <div className={styles.left}>
              <Avatar className={styles.customAvatar} circle={true} image={image} siz='primary'></Avatar>
            </div>
            <div className={styles.right}>
              <p className={styles.name}>夏冰雹</p>
              <p className={styles.text}>自己喜欢的东西就不要问别人好不好</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.item}>
              <p className={styles.title}>主题</p>
              <p className={styles.text}>108</p>
            </div>
            <div className={styles.item}>
              <p className={styles.title}>点赞</p>
              <p className={styles.text}>108</p>
            </div>
            <div className={styles.item}>
              <p className={styles.title}>已关注</p>
              <p className={styles.text}>108</p>
            </div>
            <div className={styles.item}>
              <p className={styles.title}>粉丝</p>
              <p className={styles.text}>3000</p>
            </div>
          </div>
          <div className={styles.footer}>
            <Button className={styles.btn} type='primary'><Icon className={styles.icon} name="PlusOutlined" size={12}/>关注</Button>
            <Button className={[styles.btn, styles.ghost]} type='primary' ghost><Icon className={styles.icon} name="NewsOutlined" size={12}/>发私信</Button>
            <Button className={styles.btn} type='primary'><Icon className={styles.icon} name="ShieldOutlined" size={12}/>屏蔽</Button>
          </div>
        </div>
      </div> 
    );
  }, [isShowUserInfo, userId])

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
