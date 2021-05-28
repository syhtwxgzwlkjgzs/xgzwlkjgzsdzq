import React from 'react';
import { Avatar } from '@discuzq/design';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';

const DialogBox = (props) => {
  const { shownMessages, dialogBoxRef, platform } = props;

  return (
    <div className={platform === 'pc' ? styles.pcDialogBox : styles.h5DialogBox} ref={dialogBoxRef}>
      <div className={styles.box__inner}>
        {shownMessages.map(({ timestamp, displayTimePanel, text, ownedBy, userAvatar }, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && <div className={styles.msgTime}>{diffDate(timestamp)}</div>}
            <div className={`${ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`} ${styles.persona}`}>
              <div className={styles.profileIcon}>
                <Avatar image={userAvatar || '/favicon.ico'} circle={true} />;
              </div>
              <div className={styles.msgContent}>{text}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DialogBox;
