import React, { memo } from 'react'
import styles from './index.module.scss';

const Index = () => {
  return (
    <div className={styles.wrapper}>
      账户消息 - 张鑫
    </div>
  )
}

export default memo(Index)
