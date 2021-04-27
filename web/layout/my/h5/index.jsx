import React from 'react';
import styles from './index.module.scss';
import UserCenterHeaderImage from '@components/user-center-header-images';
import UserCenterHead from '@components/user-center-head';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class H5MyPage extends React.Component {

    render() {
        const { site } = this.props;
        const { platform } = site;
        return (
            <div>
                <UserCenterHeaderImage/>
                <UserCenterHead platform={platform}/>
            </div>
        )
    }

}

export default H5MyPage;