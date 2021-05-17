import React, { useContext } from 'react';
import { Button, Icon } from '@discuzq/design';
import Avatar from '../../avatar';
import { noop } from '../utils';
import styles from './index.module.scss';
import { ThreadCommonContext } from '../utils'

/**
 * 用户信息视图
 * @prop {string}  imgSrc 用户头像
 * @prop {string}  title 用户名字
 * @prop {number}  type 免费还是付费用户
 * @prop {string}  subTitle 额外信息
 * @prop {string}  icon 用户头像右下角图标
 * @prop {string}  label 额外信息
 * @prop {string}  onClick 点击事件
 */
// TODO 点击穿透问题之后想办法解决
const Index = ({ imgSrc, title = '', type = 0, subTitle, label, index, onClick = noop, userId, platform }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick(userId);
  };

  const icon =  (type === 1) ? "LikeOutlined" :
                (type === 2) ? "HeartOutlined" :
                (type === 3) ? "HeartOutlined" : "",
        bgClrBasedOnType =  (type === 1) ? styles.like :
                              (type === 2) ? styles.heart :
                              (type === 3) ? styles.heart : "";

  return (
    <div className={styles.listItem} key={index} onClick={handleClick}>
      <div className={styles.wrapper}>
          <div className={styles.header}>
              <Avatar 
                className={styles.img} 
                image={imgSrc} 
                name={title} 
                isShowUserInfo={platform === 'pc'}
                userId={userId}
              />
              {
                icon && (
                  <div className={`${styles.icon} ${bgClrBasedOnType}`}>
                      <Icon name={icon} size={12}/>
                  </div>
                )
              }
          </div>

          <div className={styles.content}>
              <span className={styles.title}>{title}</span>
              {subTitle && <span className={styles.subTitle}>{subTitle}</span>}
          </div>
      </div>

      {
        label || label === '' ? (
          <div className={styles.footer}>
            <span className={styles.label}>{label}</span>
            <Icon className={styles.rightIcon} name="RightOutlined" size={12} />
          </div>
        ) : (
          <Button type="primary" className={styles.button} onClick={handleClick}>查看主页</Button>
        )
      }
    </div>
  );
};

export default React.memo(Index);
