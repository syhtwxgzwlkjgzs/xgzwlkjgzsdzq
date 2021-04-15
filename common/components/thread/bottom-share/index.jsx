import React, { useContext } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';

const Index = () => {
  const postList = [
    {
      icom: 'LikeOutlined',
      name: '赞'
    },
    {
      icon: 'MessageOutlined',
      name: '评论'  
    },
    {
      icon: 'ShareAltOutlined',
      name: '分享'
    }
  ]
  return (
      <div className={styles.operation}>
        {
          postList.map((item, index) => {
            return (
              <div key={index} className={styles.fabulous}>
                <Icon className={styles.icon} name={item.icon} size={14}></Icon>
                <span className={styles.fabulousPost}>{item.name}</span>
              </div>
            )
          })
        }
      </div>
  )
}

export default React.memo(Index) 