import React from 'react';
import Icon from '@discuzq/design/dist/components/icon/index';
import styles from './index.module.scss';
import { Text } from '@tarojs/components';


const ErrorView = ({ text = '加载失败，点击重新加载', onClick }) => {
    return (
        <Text className={styles.refreshView} onClick={onClick}>
            {/* <Icon name="RenovateOutlined" className={styles.spin} size={14}/> */}
            {text}
        </Text>
    )
}

export default React.memo(ErrorView)