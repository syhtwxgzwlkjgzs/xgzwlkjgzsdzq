import React from 'react';
import { Spin } from '@discuzq/design';
import styles from './index.module.scss';

/**
 *
 * @param noMore
 * @param loadText
 * @param noMoreText
 * @param isError
 * @param onRefreshPlaceholder
 * @param type noMoreText的样式类型，类型有 line：有下划线、normal：无下划线。
 * @param platform pc or h5端，pc端noMoreText无下划线，h5端noMoreText有下划线。
 * @returns {JSX.Element}
 * @constructor
 */
const RefreshView = ({noMore = false, loadText = '加载更多...', noMoreText = '没有更多内容了', isError = false, onRefreshPlaceholder = null, type = 'normal', platform = 'pc' }) => {
    return (
        <div className={`${styles.refreshView} ${onRefreshPlaceholder && styles.custom}`}>
            {
                !noMore ? (
                    onRefreshPlaceholder ? onRefreshPlaceholder() : <><Spin className={styles.spin} type="spinner"/>
                        <span>{loadText}</span></>
                ) : (
                    type !== 'normal' && platform === 'h5' ? (
                        <div>
                            <span className={styles.noMoreLeft}></span>
                            <span>{noMoreText}</span>
                            <span className={styles.noMoreRight}></span>
                        </div>) : (<span>{noMoreText}</span>)
                )
            }
        </div>
    );
}

export default React.memo(RefreshView)
