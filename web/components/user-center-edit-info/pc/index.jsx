import React, { Component } from 'react';
import Header from '@components/header';
import UserCenterEditHeader from '../../user-center-edit-header/index';
import BaseLaout from '@components/base-layout';
import { Button, Icon, Input } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import HOCFetchSiteData from '../../../middleware/HOCFetchSiteData';
@inject('site')
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClickNickName: false,
    };
    this.user = this.props.user || {};
  }

  render() {
    return (
      <div className={styles.pcEditBox} >
        <Header className={styles.pcEditHeaser}/>
        <div className={styles.pcEditContent}>
          <div className={styles.pcEdit}>
            {/* 头部 */}
            <div><UserCenterEditHeader /></div> 
            {/* 昵称 */}
            <div className={styles.pcEditNickname}>
              <div className={styles.pcEditNicknameText}>昵称</div>
              <div className={styles.pcEditNicknameCall}>
                <p className={styles.pcEditNicknameCallText}>Users</p>
                <p className={styles.pcEditNicknameCallMsodify}>修改</p>
              </div>
            </div>
            {/* 用户名 */}
            <div className={styles.pcEditNickname}>
              <div className={styles.pcEditNicknameText}>用户名</div>
              <div className={styles.pcEditNicknameCall}>
                <p className={styles.pcEditNicknameCallText}>Users</p>
                <p className={styles.pcEditNicknameCallMsodify}>修改</p>
              </div>
            </div>
            {/* 个性签名 */}
            <div className={styles.pcEditAutograph}>
              <div className={styles.pcEditAutographText}>个性签名</div>
              <div className={styles.pcEditAutographCall}>
                <Input
                  className={styles.pcEditAutographInput}
                  placeholder="不会开飞机的程序员，不是一个好的摄影师"
                />
                <div className={styles.preservation}>
                  <Button className={styles.preservationButton} type="primary">保存</Button>
                  <Button className={styles.preservationButton2}>取消</Button>
                </div>
              </div>
            </div>
            {/* 手机号码 */}
            <div className={styles.pcEditNickname}>
              <div className={styles.pcEditNicknameText}>手机号码</div>
              <div className={styles.pcEditNicknameCall}>
                <p className={styles.pcEditNicknameCallText}>11111111111</p>
                <p className={styles.pcEditNicknameCallMsodify}>修改</p>
              </div>
            </div>
            {/* 账户密码 */}
            <div className={styles.pcEditNickname}>
              <div className={styles.pcEditNicknameText}>账户密码</div>
              <div className={styles.pcEditNicknameCall}>
                <p className={styles.pcEditNicknameCallText}>已设置</p>
                <p className={styles.pcEditNicknameCallMsodify}>修改</p>
              </div>
            </div>
            {/* 支付密码 */}
            <div className={styles.pcEditNickname}>
              <div className={styles.pcEditNicknameText}>支付密码</div>
              <div className={styles.pcEditNicknameCall}>
                <p className={styles.pcEditNicknameCallText}>已设置</p>
                <p className={styles.pcEditNicknameCallMsodify}>修改</p>
              </div>
            </div>
            {/* 微信 */}
            <div className={styles.pcEditNickname}>
              <div className={styles.pcEditNicknameText}>微信</div>
              <div className={styles.pcEditNicknameCall}>
                <div className={styles.pcEditNicknameImgs}>
                  <Avatar className={styles.pcEditNicknameImg} image={this.user.avatarUrl} name={this.user.username} />
                  <p className={styles.pcEditWeiName}>Users</p>
                </div>
                <p className={styles.pcEditNicknameCallMsodify}>修改</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default index;