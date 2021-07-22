import React, { Component } from 'react';
import styles from './index.module.scss';
import { Spin, Input, Icon, Dialog, Toast, Button } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import additionalInfoData from './test.json';

export default class UserCenterAdditionalInfo extends Component {
  // 处理单选字段
  getRadioFieldValue = (data = []) => {
    const resultValue = data.map((i) => {
      if (i.checked) {
        return i.value || '';
      }
    });
    return resultValue;
  };

  // 处理多选字段
  getCheckboxFieldValue = (data = []) => {
    const resultValue = [];
    data.map((i) => {
      if (i.checked) {
        resultValue.push(i.value);
      }
    });
    return resultValue.join('');
  };

  /**
   * 渲染每一条item
   * type 0 文本| 1 多行文本|2 单选|3 多选|4 图片|5 附件
   */
  renderAdditionalItem = (item) => {
    const { type, fieldsExt = [] } = item;
    switch (type) {
      case 0:
        return <div className={`${styles.additionValue} ${styles.singleText}`}>{item.fieldsExt}</div>;
      case 1:
        return <div className={styles.additionValue}>{item.fieldsExt}</div>;
      case 2:
        return <div className={styles.additionValue}>{this.getRadioFieldValue(fieldsExt)}</div>;
      case 3:
        return (
          <div className={styles.checkboxValue}>
            {fieldsExt.map(d => <div className={styles.additionValue}>{d.value}</div>)}
          </div>
        );
      case 4:
        return (
          <div className={styles.cardItem}>
            {fieldsExt.map((d, i) => (
                <div className={`${styles.identityCard} ${i != fieldsExt.length - 1 && styles.identityCardBottom}`}>
                  <img src={d.url} className={styles.identityImg} />
                </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className={styles.additionValue}>
            <Icon size={16} color={'#8490A8'} name="PaperClipOutlined" />
            <span className={styles.additionFile}>附件已上传</span>
          </div>
        );
      default:
        break;
    }
  };

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
              {additionalInfoData.map(item => (
                  <div
                    className={`${styles.additionItem} ${item.type === 4 && styles.additionIdentityCard}`}
                    style={{ alignItems: (item.type === 1 || item.type === 3) && 'flex-start' }}
                  >
                    <div className={styles.additionLabel}>{item.name}</div>
                    {this.renderAdditionalItem(item)}
                  </div>
              ))}
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
