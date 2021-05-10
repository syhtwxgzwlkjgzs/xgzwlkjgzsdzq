import React from 'react';
import { View } from '@tarojs/components';
import { Icon } from '@discuzq/design';

import styles from './index.module.scss';

const DialogBox = (props) => {
  const { shownMessages, persona = 'itself', dialogBoxRef } = props;

  const formatMsgDate = (timestamp) => {
    const date = new Date(timestamp),
      m = date.getMonth() + 1,
      d = date.getDate();
    return (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + date.toTimeString().substr(0, 5);
  };

  const displayMsgTime = (curTimestamp) => {
    const formattedDate = formatMsgDate(curTimestamp);
    return <View className={styles.msgTime}>{formattedDate}</View>;
  };

  return (
    <View className={styles.dialogBox} ref={dialogBoxRef}>
      {shownMessages.map(({ timestamp, displayTimePanel, text }, idx) => (
        <React.Fragment key={idx}>
          {displayTimePanel && displayMsgTime(timestamp)}
          <View className={(persona === 'myself' ? `${styles.myself}` : `${styles.itself}`) + ` ${styles.persona}`}>
            <View className={styles.profileIcon}>
              <Icon name="UserOutlined" size={20} color={'var(--color-primary)'} />
            </View>
            <View className={styles.msgContent}>{text}</View>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

export default DialogBox;
