import React from 'react';
import styles from './index.module.scss';
import H5HeadetContent from './h5/index'

class UserCenterHead extends React.Component {

    renderPCContent() {
        return (
            <div className={styles.pcbox}>
            
            </div>
        )
    }

    render() {
        const { platform } = this.props;
        if (platform === 'h5') {
            return <H5HeadetContent />;
        } else {
            return this.renderH5Content();
        }
    }

}

export default UserCenterHead;