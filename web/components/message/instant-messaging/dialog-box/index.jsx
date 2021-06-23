import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import { Avatar, ImagePreviewer, Icon } from '@discuzq/design';
import { diffDate } from '@common/utils/diff-date';
import { inject, observer } from 'mobx-react';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';

const DialogBox = (props, ref) => {
  const { platform, message, showEmoji, scrollEnd, messagesList } = props;
  const { dialogMsgList } = message;
  const [previewerVisibled, setPreviewerVisibled] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');

  const imagePreviewerUrls = useMemo(() => {
    return dialogMsgList.list.filter(item => !!item.imageUrl).map(item => item.imageUrl).reverse();
  }, [dialogMsgList]);


  const renderImage = (url, isImageLoading) => {
    // console.log(url);
    // const urlObj = new URL(url);
    // const width = urlObj.searchParams.get("width");
    // const height = urlObj.searchParams.get("height");
    let renderWidth = 200;

    // if (width && height) {
    //   if (width <= height) {
    //     renderWidth = 70;
    //   } else {
    //     renderWidth = 130;
    //   }
    // }
    return (
      <div className={styles['msgImage-container']}>
        {isImageLoading && (
          <div className={styles['msgImage-uploading']}>
            <Icon className={styles.loading} name="LoadingOutlined" size={40} />
          </div>
        )}
        <img
          className={styles.msgImage}
          style={{ width: `${renderWidth}px` }}
          src={url}
          onClick={() => {
            setDefaultImg(url);
            setTimeout(() => {
              setPreviewerVisibled(true);
            }, 0);
          }}
          onLoad={scrollEnd}
        />
      </div>
    );
  };

  return (
    <div className={platform === 'pc' ? styles.pcDialogBox : (showEmoji ? styles['h5DialogBox-emoji'] : styles.h5DialogBox)} ref={ref}>
      <div className={styles.box__inner}>
        {messagesList.map(({ timestamp, displayTimePanel, text, ownedBy, userAvatar, imageUrl, userId, nickname, isImageLoading }, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && <div className={styles.msgTime}>{diffDate(timestamp)}</div>}
            <div className={`${ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`} ${styles.persona}`}>
              <div className={styles.profileIcon} onClick={() => {
                userId && Router.push({ url: `/user/${userId}` });
              }}>
                {userAvatar
                  ? <Avatar image={userAvatar} circle={true} />
                  : <Avatar text={nickname && nickname.toUpperCase()[0]} circle={true} style={{
                    backgroundColor: "#8590a6",
                  }} />
                }
              </div>
              {imageUrl ? (
                renderImage(imageUrl, isImageLoading)
              ) : (
                <div className={styles.msgContent} dangerouslySetInnerHTML={{
                  __html: xss(s9e.parse(text)),
                }}></div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <ImagePreviewer
        visible={previewerVisibled}
        onClose={() => {
          setPreviewerVisibled(false);
        }}
        imgUrls={imagePreviewerUrls}
        currentUrl={defaultImg}
      />
    </div>
  );
};

export default inject('message', 'user')(observer(forwardRef(DialogBox)));
