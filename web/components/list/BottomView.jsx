import React from 'react';
import ErrorView from './ErrorView';
import RefreshView from './RefreshView';
import { noop } from '@components/thread/utils';

import styles from './index.module.scss';

const Index = ({ 
    isError = false, 
    noMore = false, 
    loadingView = null, 
    errorView = null, 
    loadingText = '加载更多...', 
    noMoreText = '没有更多内容了', 
    errorText = '加载失败', 
    handleError = noop,
    onRefresh,
    isBox = false
}) => {
    return (
        <div className={isBox ? styles.bottomViewBox : ''}>
            {!isError ? (
                loadingView || <RefreshView noMore={noMore} loadText={loadingText} noMoreText={noMoreText} />
            ) : (
                errorView || <ErrorView text={errorText || '加载失败'} onClick={handleError} />
            )}
        </div>
    )
}

export default React.memo(Index)