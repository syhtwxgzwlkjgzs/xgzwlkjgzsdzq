import React from 'react';
import ErrorView from './ErrorView';
import RefreshView from './RefreshView';
import { noop } from '@components/thread/utils';
import Copyright from '@components/copyright';
import styles from './index.module.scss';

/**
 *
 * @param {function} handleError 处理点击报错信息
 * @returns
 */
const Index = ({
    isError = false,
    noMore = false,
    loadingView = null,
    errorView = null,
    loadingText = '加载更多...',
    noMoreText = '没有更多内容了',
    errorText = '加载失败',
    noMoreType = 'normal',
    platform= 'pc',
    isShowLine = false,
    handleError = noop,
    isBox = false,
    className='',
    onRefreshPlaceholder = null,
    copyright = false
}) => {
    return (
        <div class={styles.bottomViewContainer }>
            <div className={`${styles.bottomView} ${className} ${isBox ? styles.bottomViewBox : ''}`}>
                {!isError ? (
                    loadingView || <RefreshView onRefreshPlaceholder={onRefreshPlaceholder} noMore={noMore} loadText={loadingText} noMoreText={noMoreText} noMoreType={noMoreType} />
                ) : (
                    errorView || <ErrorView text={errorText || '加载失败'} onClick={handleError} />
                )}
            </div>
            {copyright && <Copyright marginTop={0} marginBottom={15} />}
        </div>
    )
}

export default React.memo(Index)
