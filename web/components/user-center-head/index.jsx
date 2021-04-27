import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';

class UserCenterHead extends React.Component {

    renderH5Content() {
        return (
            <div className={styles.h5box}>
                <div className={styles.headImgBox}>
                    <Avatar size='big'/>
                </div>
                <p className={styles.text}>不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师</p>
            </div>
        )
    }

    renderPCContent() {
        return (
            <div className={styles.pcbox}>
            
            </div>
        )
    }

    render() {
        const { platform } = this.props;
        if (platform === 'h5') {
            return this.renderH5Content();
        } else {
            return this.renderH5Content();
        }
    }

}

export default UserCenterHead;