import React, { Component } from 'react';
import styles from './index.module.scss';
import { Spin, Input, Icon, Dialog, Toast, Button } from '@discuzq/design';
import { inject, observer } from 'mobx-react';

export default class UserCenterAdditionalInfo extends Component {
  render() {
    return (
      <div className={styles.additionalWrapper}>
        <Dialog visible={this.props.visible} position="center" maskClosable={true} onClose={this.props.onClose}>
          <div className={styles.additionalContainer}>
            {/* 头部区域 */}
            <div className={styles.title}>
              <span className={styles.titleValue}>补充信息</span>
              <Icon size={12} color={'#8490A8'} onClick={this.props.onClose} name="CloseOutlined" />
            </div>
            {/* 内容区域 */}
            <div className={styles.additionalContent}>
              <div className={styles.additionItem}>
                <div className={styles.additionLabel}>真实姓名</div>
                <div className={styles.additionValue}>xxx</div>
              </div>
              <div className={styles.additionItem}>
                <div className={styles.additionLabel}>性别</div>
                <div className={styles.additionValue}>女</div>
              </div>
              <div className={styles.additionItem}>
                <div className={styles.additionLabel}>注册原因</div>
                <div className={styles.additionValue}>xxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
              </div>
              <div className={`${styles.additionItem} ${styles.additionIdentityCard}`}>
                <div className={styles.additionLabel}>身份证</div>
                <div className={styles.cardItem}>
                  {/* <img /> */}
                  <div className={styles.identityCard}>
                    <span className={styles.iCardText}>身份证正面照</span>
                  </div>
                  <div className={styles.identityCard}>
                    <span className={styles.iCardText}>身份证正面照</span>
                  </div>
                </div>
              </div>
              <div className={styles.additionItem}>
                <div className={styles.additionLabel}>体检资质证明</div>
                <div className={styles.additionValue}>
                  <Icon size={16} color={'#8490A8'} name="PaperClipOutlined" />
                  <span className={styles.additionFile}>附件已上传</span>
                </div>
              </div>
            </div>
            {/* 提示 */}
            <p className={styles.additionTips}>
              <span className={styles.note}>*</span>补充信息设置后不能修改，如有疑问请联系站长处理
            </p>
          </div>
        </Dialog>
      </div>
    );
  }
}
