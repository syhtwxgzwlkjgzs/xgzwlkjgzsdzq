import React from 'react';
import { Icon } from '@discuzq/design';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';

const DialogBox = (props) => {
  const { shownMessages, persona = 'itself', dialogBoxRef, platform } = props;

  return (
    <div className={platform === 'pc' ? styles.pcDialogBox : styles.h5DialogBox} ref={dialogBoxRef}>
      {shownMessages.map(({ timestamp, displayTimePanel, text }, idx) => (
        <React.Fragment key={idx}>
          {displayTimePanel && <div className={styles.msgTime}>{diffDate(timestamp)}</div>}
          <div className={(persona === 'myself' ? `${styles.myself}` : `${styles.itself}`) + ` ${styles.persona}`}>
            <div className={styles.profileIcon}>
              <Icon name="UserOutlined" size={20} color={'var(--color-primary)'} />
            </div>
            <div className={styles.msgContent}>{text}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default DialogBox;
