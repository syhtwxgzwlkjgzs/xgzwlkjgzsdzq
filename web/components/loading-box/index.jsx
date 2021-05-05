import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';

export default function LoadingBox() {
    return (
        <div className={styles.loadingBox}>
            <Icon className={styles.loading} name="LoadingOutlined" size="large" />
        </div>
    );
}