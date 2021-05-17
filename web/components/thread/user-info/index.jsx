import PropTypes from 'prop-types';
import { Icon, Tag } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import React from 'react';
import { diffDate } from '@common/utils/diff-date';
import classNames from 'classnames';

UserInfo.propTypes = {
  name: PropTypes.string.isRequired, // 用户名称
  avatar: PropTypes.string.isRequired, // 用户头像
  groupName: PropTypes.string, // 用户组
  time: PropTypes.string, // 发帖时间
  location: PropTypes.string, // 地址
  view: PropTypes.string, // 浏览量
  onClick: PropTypes.func,
  isEssence: PropTypes.bool, // 是否精华
  isPay: PropTypes.bool, // 是否付费
  isReward: PropTypes.bool, // 是否悬赏
  isRed: PropTypes.bool, // 是否红包
  userId: PropTypes.number, // 用户id PC端
  platform: PropTypes.string, // 是否展示pop PC端
};

export default function UserInfo(props) {
  return (
    <div className={styles.contianer}>
      <Avatar
        isShowUserInfo={props.platform === 'pc'}
        userId={props.userId}
        className={styles.avatar}
        circle={true}
        image={props.avatar}
        name={props.name || ''}
        onClick={() => props.onClick()}
      ></Avatar>

      <div className={styles.right}>
        <div className={styles.info}>
          <div className={styles.name}>{props.name}</div>
          {props.groupName && <div className={styles.groupName}>{props.groupName}</div>}
        </div>

        <div className={styles.meta}>
          {props.time && <span className={styles.time}>{diffDate(props.time)}</span>}
          {props.location && (
            <div className={styles.location}>
              <Icon name="PositionOutlined" size={14}></Icon>
              <span>{props.location}</span>
            </div>
          )}
          {props.view && (
            <div className={styles.view}>
              <Icon name="EyeOutlined" className={styles.viewIcon}></Icon>
              <span>{props.view}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tags}>
        {props.isEssence && (
          <div className={classNames('dzq-tag', styles.categoryEssence)}>
            <span className="dzq-tag-text">精</span>
          </div>
        )}
        {/* {props.isEssence && <Tag type="primary">精华</Tag>} */}
        {props.isPay && <Tag type="success">付</Tag>}
        {props.isReward && <Tag type="warning">悬</Tag>}
        {props.isRed && <Tag type="danger">红</Tag>}
      </div>
    </div>
  );
}
