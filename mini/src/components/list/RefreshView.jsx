import React from 'react';
import { Spin } from '@discuzq/design';
import { View, Text } from '@tarojs/components';

import styles from './index.module.scss';


const RefreshView = ({noMore = false, loadText = '加载更多...', noMoreText = '没有更多内容了', isError = false }) => {
    return (
        <View className={styles.refreshView}>
            { 
                !noMore ? (
                    <>
                        <Spin className={styles.spin} type="spinner" /> <Text>{loadText}</Text>
                    </>
                ) : <Text>{ noMoreText }</Text>
            }
        </View>
    )
}

export default React.memo(RefreshView)