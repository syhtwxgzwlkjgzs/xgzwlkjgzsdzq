import React, { Component } from 'react'
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { Button, Icon } from '@discuzq/design';

export default class index extends Component {
  render() {
    return (
      <div className={styles.h5box}>
        {/* 上 */}
        <div className={styles.h5boxTop}>
          <div className={styles.headImgBox}>
            <Avatar size='big' />
          </div>
          {/* 粉丝|关注|点赞 */}
          <div className={styles.userMessageList}>
            <div className={styles.userMessageListItem}>
              <span>粉丝</span>
              <span>2880</span>
            </div>
            <div className={styles.userMessageListItem}>
              <span>关注</span>
              <span>974</span>
            </div>
            <div className={styles.userMessageListItem}>
              <span>点赞</span>
              <span>1368</span>
            </div>
          </div>
        </div>
        {/* 中 用户昵称和他所在的用户组名称 */}
        <div>
          <div className={styles.userNameOrTeam}>
            <span>Amber</span>
            <span>官方团队</span>
          </div>
          <p className={styles.text}>不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师</p>
        </div>
        {/* 下 */}
        <div className={styles.userBtn}>
          <Button type="primary">
            <Icon name="CompileOutlined" />
            <span className={styles.userBtnText}>编辑资料</span>
          </Button>
          <Button>
            <Icon name="PoweroffOutlined" />
            <span className={styles.userBtnText}>退出登录</span>
          </Button>
        </div>
      </div>
    )
  }
}
