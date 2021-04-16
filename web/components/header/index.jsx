import {useCallback} from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import Router from '@common/utils/web-router';
export default function Header() {

    // todo
    const iconClickHandle = useCallback((type) => {
        console.log(type);
    }, []);

    const gobackClickHandle = useCallback(() => {
        Router.back();
    }, []);

    return (
        <duv className={styles.header}>
            <div className={styles.headerContent}>
                <div onClick={gobackClickHandle} className={styles.left}>返回</div>
                <div className={styles.right}>
                    <Icon onClick={() => {iconClickHandle('home')}} name="HomeOutlined" color="red" size={24} />
                    <Icon onClick={() => {iconClickHandle('msg')}} name="MessageOutlined" color="red" size={24} />
                    <Icon onClick={() => {iconClickHandle('user')}} name="UserOutlined" color="red" size={24} />
                </div>
            </div>
        </duv>
    )
}