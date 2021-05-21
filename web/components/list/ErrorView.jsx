import React from 'react';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';


const ErrorView = ({ text = '加载失败', onClick }) => {
    return (
        <div className={styles.refreshView} onClick={onClick}>
            <Icon name="RenovateOutlined" className={styles.spin} size={14}/>
            {text}
        </div>
    )
}

export default React.memo(ErrorView)