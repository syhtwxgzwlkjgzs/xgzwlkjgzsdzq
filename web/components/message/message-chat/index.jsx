import React, { memo } from 'react'
import styles from './index.module.scss';

const Index = () => {
  return (
    <div className={styles.wrapper}>
      聊天
    </div>
  )
}

export default memo(Index)
