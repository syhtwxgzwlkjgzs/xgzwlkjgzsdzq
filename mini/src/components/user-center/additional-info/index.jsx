import React, { Component } from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import Icon from '@discuzq/design/dist/components/icon/index';
import Toast from '@discuzq/design/dist/components/toast/index';

export default class UserCenterAdditionalInfo extends Component {
  render() {
    return (
      <View className={styles.additionalWrapper}>
        <View className={styles.additionalContainer}>
          {/* 头部区域 */}
          <View className={styles.title}>
            <Text className={styles.titleValue}>您的补充信息已设置</Text>
          </View>
          {/* 内容区域 */}
          <View className={styles.additionalContent}>
            <View className={styles.additionItem}>
              <View className={styles.additionLabel}>真实姓名</View>
              <View className={styles.additionValue}>xxx</View>
            </View>
            <View className={styles.additionItem}>
              <View className={styles.additionLabel}>性别</View>
              <View className={styles.additionValue}>女</View>
            </View>
            <View className={styles.additionItem}>
              <View className={styles.additionLabel}>注册原因</View>
              <View className={styles.additionValue}>xxxxxxxxxxxxxxxxxxxxxxxxxxxx</View>
            </View>
            <View className={`${styles.additionItem} ${styles.additionIdentityCard}`}>
              <View className={styles.additionLabel}>身份证</View>
              <View className={styles.cardItem}>
                {/* <img /> */}
                <View className={styles.identityCard}>
                  <Text className={styles.iCardText}>身份证正面照</Text>
                </View>
                <View className={styles.identityCard}>
                  <Text className={styles.iCardText}>身份证正面照</Text>
                </View>
              </View>
            </View>
            <View className={styles.additionItem}>
              <View className={styles.additionLabel}>体检资质证明</View>
              <View className={styles.additionValue}>
                <Icon size={16} color={'#8490A8'} name="PaperClipOutlined" />
                <Text className={styles.additionFile}>附件已上传</Text>
              </View>
            </View>
          </View>
          {/* 提示 */}
          <View className={styles.additionTips}>
            <Text className={styles.note}>*</Text>补充信息设置后不能修改，如有疑问请联系站长处理
          </View>
        </View>
      </View>
    );
  }
}
