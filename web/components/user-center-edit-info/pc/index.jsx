import React, { Component, Suspense } from 'react';
import Header from '@components/header';
import UserCenterEditHeader from '../../user-center-edit-header/index';
import BaseLaout from '@components/base-layout';
import { Button, Icon, Input } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import HOCFetchSiteData from '../../../middleware/HOCFetchSiteData';
import UserCenterEditAccountPwd from '../../user-center-edit-account-pwd-pc';

@inject('site')
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClickNickName: false,
      contentTitle: [
        {
          name: '昵称',
          type: 1,
          display: 0,
        },
        {
          name: '用户名',
          type: 2,
          display: 0,
        },
        {
          name: '个性签名',
          type: 3,
          display: 0,
        },
        {
          name: '手机号码',
          type: 4,
          display: 0,
        },
        {
          name: '账户密码',
          type: 5,
          display: 0,
        },
        {
          name: '支付密码',
          type: 6,
          display: 0,
        },
      ],
    };
    this.user = this.props.user || {};
  }
  editorialpresentation(item, type, index) {
    let textTitle = '';
    switch (type) {
      case 1: textTitle = this.user.username;
        break;
      case 2: textTitle = this.user.username;
        break;
      case 3: textTitle = '这个人很懒，什么也没留下~';
        break;
      case 4: textTitle = this.user.mobile;
        break;
      case 5: textTitle = '已设置';
        break;
      case 6: textTitle = '已设置';
        break;
    }
    return (
      <>
        <div className={styles.pcEditNickname}>
          <div className={styles.pcEditNicknameText}>{item.name}</div>
          <div className={styles.box}>
            {
              item.display === 0 && <div className={styles.pcEditNicknameCall}>
                <p className={styles.pcEditNicknameCallText}>{textTitle}</p>
                <p className={styles.pcEditNicknameCallMsodify} onClick={() => this.modifyFun(index, 1)}>修改</p>
              </div>
            }
            {
              <div className={item.display === 1 ? styles.pcEditAutographCall : styles.pcEditAutographBox}>
                <Input
                  className={styles.pcEditAutographInput}
                  placeholder="这个人很懒，什么也没留下~"
                />
                <div className={styles.preservation}>
                  <Button className={styles.preservationButton} type="primary" onClick={() => this.modifyFun(index, 0)}>保存</Button>
                  <Button className={styles.preservationButton2} onClick={() => this.modifyFun(index, 0)}>取消</Button>
                </div>
              </div>
            }
          </div>
        </div>
      </>
    );
  }
  modifyFun = (index, num) => {
    const todoList = [...this.state.contentTitle];
    this.setState({
      contentTitle: todoList.map((item, key) => (key == index ? { ...item, display: num } : item)),
    });
  }
  render() {
    const { contentTitle } = this.state;
    return (
      <div className={styles.pcEditBox} >
        <Header className={styles.pcEditHeaser}/>
        <div className={styles.pcEditContent}>
          <div className={styles.pcEdit}>
            {/* 头部 */}
            <div><UserCenterEditHeader /></div>
            {/* 资料展示 */}
            {
              contentTitle.map((item, index) => (
                  <div key={index}>
                    {this.editorialpresentation(item, item.type, index)}
                  </div>
              ))
            }
            <div className={styles.pcEditNickname}>
              <div className={styles.pcEditNicknameText}>微信</div>
              <div className={styles.pcEditNicknameCall}>
                <div className={styles.pcEditNicknameImgs}>
                  <Avatar className={styles.pcEditNicknameImg} image={this.user.avatarUrl} name={this.user.username} />
                  <p className={styles.pcEditWeiName}>{this.user.username}</p>
                </div>
                <p className={styles.pcEditNicknameCallMsodify}>解绑</p>
              </div>
            </div>
          </div>
          <div className={styles.bottomText}>Powered By Discuz! Q © 2021   粤ICP备20008502号-1</div>
        </div>
        <UserCenterEditAccountPwd />
      </div>
    );
  }
}

export default index;
