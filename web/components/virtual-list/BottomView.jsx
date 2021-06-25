import React from 'react';
import ErrorView from './ErrorView';
import RefreshView from './RefreshView';
import { noop } from '@components/thread/utils';

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
    type = 'normal',
    platform= 'pc',
    isShowLine = false,
    handleError = noop,
    isBox = false,
    className='',
    onRefreshPlaceholder = null
}) => {
    return (
        <div className={`${styles.bottomView} ${className} ${isBox ? styles.bottomViewBox : ''}`}>
            {!isError ? (
                loadingView || <RefreshView onRefreshPlaceholder={onRefreshPlaceholder} noMore={noMore} loadText={loadingText} noMoreText={noMoreText} type={type} platform={platform} />
            ) : (
                errorView || <ErrorView text={errorText || '加载失败'} onClick={handleError} />
            )}
        </div>
    )
}

export default React.memo(Index)
