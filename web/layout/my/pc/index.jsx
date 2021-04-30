import React from 'react';
import styles from './index.module.scss';
import clearLoginStatus from '@common/utils/clear-login-status'; 
import { Button } from '@discuzq/design';

class PCMyPage extends React.Component {
    loginOut() {
        clearLoginStatus();
        window.location.replace('/');
    }
    
    render() {
        return (
            <div>
                <h1>pc</h1>
                <Button onClick={this.loginOut}>退出登录</Button>
            </div>
        )
    }

}

export default PCMyPage;