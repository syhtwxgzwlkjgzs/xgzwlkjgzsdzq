import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { Icon, Input, Button } from '@discuzq/design';
import Avatar from '@components/avatar';

@inject('site')
@inject('user')
@observer
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  renderHeaderLogo() {
    const { site } = this.props;
    if (site.setSite && site.setSite.siteLogo && site.setSite.siteLogo !== '') {
      return <img className={styles.siteLogo} src={site.setSite.siteLogo}/>;
    }
    return <img className={styles.siteLogo} src='/dzq-img/admin-logo-pc.png'/>;
  }

  renderUserInfo() {
    // todo 跳转
    const { user } = this.props;
    if (user && user.userInfo && user.userInfo.id) {
      return (
                <div className={styles.userInfo}>
                    <Avatar className={styles.avatar} name={user.userInfo.username} circle={true} image={user.userInfo.avatarUrl} onClick={() => {}}></Avatar>
                    <p className={styles.userName}>{user.userInfo.username || ''}</p>
                </div>
      );
    }

    return (
            <div className={styles.userInfo}>
                <Button className={styles.userBtn} type='primary'>登录</Button>
                <Button className={styles.userBtn}>注册</Button>
            </div>
    );
  }

  iconClickHandle(type) {
    console.log(type);
  }

  render() {
    const { site, user } = this.props;
    console.log(site);
    console.log(user);

    return (
            <div className={styles.header}>
                <div className={styles.headerFixedBox}>
                    <div className={styles.headerContent}>
                        <div className={styles.left}>
                            {this.renderHeaderLogo()}
                            <div className={styles.inputBox}>
                                <Input placeholder='搜索' style={{ width: '580px' }} icon='SearchOutlined'/>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.iconList}>
                                <div className={styles.iconItem}>
                                    <Icon onClick={() => {
                                      this.iconClickHandle('home');
                                    }} name="HomeOutlined" size={15} />
                                    <p>首页</p>
                                </div>
                                <div className={styles.iconItem}>
                                    <Icon onClick={() => {
                                      this.iconClickHandle('home');
                                    }} name="MessageOutlined" size={15} />
                                    <p>消息</p>
                                </div>
                                <div className={styles.iconItem}>
                                    <Icon onClick={() => {
                                      this.iconClickHandle('home');
                                    }} name="FindOutlined" size={15} />
                                    <p>发现</p>
                                </div>
                            </div>
                            {this.renderUserInfo()}
                        </div>
                    </div>
                </div>
            </div>
    );
  }
}

export default Header;
