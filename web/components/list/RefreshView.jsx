import React from 'react';
import { Spin } from '@discuzq/design';
import styles from './index.module.scss';


const RefreshView = ({noMore = false, loadText = '加载更多...', noMoreText = '没有更多内容了', isError = false, onRefreshPlaceholder = null }) => {
    return (
        <div className={`${styles.refreshView} ${onRefreshPlaceholder && styles.custom}`}>
            { 
                !noMore ? (
                    onRefreshPlaceholder ? onRefreshPlaceholder() : <><Spin className={styles.spin} type="spinner" /> <span>{loadText}</span></> 
                ) : <span>{ noMoreText }</span>
            }
        </div>
    )
}

export default React.memo(RefreshView)