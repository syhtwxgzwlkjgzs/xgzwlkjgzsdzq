import PropTypes from 'prop-types';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import React from 'react';

export default function UserInfo(props) {
  return <div className={styles.contianer}>
        <Avatar
            className={styles.avatar}
            circle={true}
            image={props.avatar}
            name={props.name || ''}
            onClick={() => props.onClick()}>
        </Avatar>
        <div className={styles.right}>
            <span className={styles.name}>{props.name}</span>
            <div className={styles.meta}>
                {
                    props.time && <span className={styles.time}>{props.time}</span>
                }
                {
                    props.location && <div className={styles.location}>
                        <Icon name="FindOutlined"></Icon>
                        <span>{props.location}</span>
                    </div>
                }
                {
                    props.view && <div className={styles.view}>
                        <Icon name="EyeOutlined"></Icon>
                        <span>{props.view}</span>
                    </div>
                }
            </div>
        </div>
    </div>;
}


UserInfo.propTypes = {
  name: PropTypes.string.isRequired, // 用户名称
  avatar: PropTypes.string.isRequired, // 用户头像
  time: PropTypes.string, // 发帖时间
  location: PropTypes.string, // 地址
  view: PropTypes.string, // 浏览量
  onClick: PropTypes.func,
};
