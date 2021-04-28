import React from 'react';
import styles from './index.module.scss';


class UserCenterHeaderImage extends React.Component {

    render() {
        return (
            <div className={styles.box} style={{backgroundImage: "url('/dzq-img/my-default-header-img.jpg')"}}/>
        )
    }

}

export default UserCenterHeaderImage;