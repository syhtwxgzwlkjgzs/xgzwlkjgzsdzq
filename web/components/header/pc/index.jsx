import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { Icon, Input, Button } from '@discuzq/design';
import Avatar from '@components/avatar';
import { withRouter } from 'next/router';
import goToLoginPage from '@common/utils/go-to-login-page';
import Router from '@discuzq/sdk/dist/router';

@inject('site')
@inject('user')
@observer
class Header extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';
    this.state = {
      value: keyword,
    };
  }

  // state = {
  //   value: ''
  // }

  onChangeInput = (e) => {
    this.setState({
      value: e,
    });
  };

  handleSearch = (e) => {
    const { onSearch } = this.props;
    if (!onSearch) {
      Router.push({url: `/search?keyword=${e.target?.value || ''}`});
    } else {
      onSearch(e.target?.value || '');
    }
  };

  handleIconClick = () => {
    const { onSearch } = this.props;
    if (!onSearch) {
      Router.push({url: `/search?keyword=${e.target?.value || ''}`});
    } else {
      onSearch(e.target?.value || '');
    }
  };

  handleRouter = (url) => {
    this.props.router.push(url);
  };
  // 登录
  toLogin = () => {
    goToLoginPage({ url: '/user/login' });
  };
  toRegister = () => {
    Router.push({url: '/user/register'});
  }

  renderHeaderLogo() {
    const { site } = this.props;
    if (site.setSite && site.setSite.siteLogo && site.setSite.siteLogo !== '') {
      return <img className={styles.siteLogo} src={site.setSite.siteLogo} onClick={() => this.handleRouter('/')} />;
    }
    return <img className={styles.siteLogo} src="/dzq-img/admin-logo-pc.png" onClick={() => this.handleRouter('/')} />;
  }

  handleUserInfoClick = () => {
    this.props.router.push('/my');
  };

  renderUserInfo() {
    // todo 跳转
    const { user, site } = this.props;
    if (user && user.userInfo && user.userInfo.id) {
      return (
        <div className={styles.userInfo} onClick={this.handleUserInfoClick}>
          <Avatar
            className={styles.avatar}
            name={user.userInfo.username}
            circle={true}
            image={user.userInfo?.avatarUrl}
            onClick={() => {}}
          ></Avatar>
          <p className={styles.userName}>{user.userInfo.username || ''}</p>
        </div>
      );
    }

    return (
      <div className={styles.userInfo}>
        <Button className={styles.userBtn} type="primary" onClick={this.toLogin}>
          登录
        </Button>
        {site.isRegister && <Button onClick={this.toRegister} className={`${styles.userBtn} ${styles.registerBtn}`}>注册</Button>}
      </div>
    );
  }

  iconClickHandle(type) {
    console.log(type);
  }

  render() {
    const { site, user } = this.props;

    return (
      <div className={styles.header}>
        <div className={styles.headerFixedBox}>
          <div className={styles.headerContent}>
            <div className={styles.left}>
              {this.renderHeaderLogo()}
              <div className={styles.inputBox}>
                <Input
                  placeholder="搜索"
                  style={{ width: '580px' }}
                  icon="SearchOutlined"
                  value={this.state.value}
                  onEnter={this.handleSearch}
                  onChange={e => this.onChangeInput(e.target.value)}
                  onIconClick={this.handleIconClick}
                />
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.iconList}>
                <div className={styles.iconItem} onClick={() => this.handleRouter('/')}>
                  <Icon
                    onClick={() => {
                      this.iconClickHandle('home');
                    }}
                    name="HomeOutlined"
                    size={15}
                  />
                  <p>首页</p>
                </div>
                {false && <div className={styles.iconItem} onClick={() => this.handleRouter('/message')}>
                  <Icon
                    onClick={() => {
                      this.iconClickHandle('home');
                    }}
                    name="MailOutlined"
                    size={17}
                  />
                  <p>消息</p>
                </div>}
                <div className={styles.iconItem} onClick={() => this.handleRouter('/search')}>
                  <Icon
                    onClick={() => {
                      this.iconClickHandle('home');
                    }}
                    name="FindOutlined"
                    size={17}
                  />
                  <p>发现</p>
                </div>
              </div>
              <div className={styles.border}></div>
              {this.renderUserInfo()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
