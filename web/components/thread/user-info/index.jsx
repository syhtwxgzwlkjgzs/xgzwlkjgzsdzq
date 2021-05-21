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
  icon: PropTypes.string, // 图标：点赞或者是付费用户
};

export default function UserInfo(props) {
  let tagsNumber = 0;

  props.isEssence && (tagsNumber = tagsNumber + 1);
  props.isPay && (tagsNumber = tagsNumber + 1);
  props.isReward && (tagsNumber = tagsNumber + 1);
  props.isRed && (tagsNumber = tagsNumber + 1);

  const isPc = props.platform === 'pc';

  return (
    <div className={classNames(styles.contianer, !props.hideInfoPopip && styles.cursor)}>
      <Avatar
        isShowUserInfo={!props.hideInfoPopip && props.platform === 'pc'}
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
            <span className="dzq-tag-text">{tagsNumber > 2 && !isPc ? '精' : '精华'}</span>
          </div>
        )}
        {/* {props.isEssence && <Tag type="primary">精华</Tag>} */}
        {props.isReward && <Tag type="warning">{tagsNumber > 2 && !isPc ? '悬' : '悬赏'}</Tag>}
        {props.isRed && <Tag type="danger">{tagsNumber > 2 && !isPc ? '红' : '红包'}</Tag>}
        {props.isPay && <Tag type="success">{tagsNumber > 2 && !isPc ? '付' : '付费'}</Tag>}
      </div>
    </div>
  );
}
