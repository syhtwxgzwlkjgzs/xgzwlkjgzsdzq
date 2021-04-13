import React, { useContext } from 'react';
import styles from './index.module.scss';

/**
 * 红包
 * @prop {string} content 红包内容
 */

const Index = ({ content }) => {
    return (
        <div className={styles.container}>
            <div className={styles.money}></div>
            <div className={styles.content}>{content}</div>
        </div>
    )
}

export default React.memo(Index) 