import React from 'react';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import classNames from 'classnames';
import { Popup } from '@discuzq/design';
const index = ({ onClose, handleShare, show, createCard }) => (
      <Popup
        position="bottom"
        visible={show}
        onClose={onClose}
      >
        <div className={styles.body}>
          <div className={styles.container}>
            <div className={classNames(styles.more, styles.oneRow)}>
                <div className={styles.moreItem} onClick={createCard}>
                    <div className={styles.icon}>
                        <Icon name='PictureOutlinedBig' size={20}>
                        </Icon>
                    </div>
                    <span className={styles.text}>
                        生成海报
                    </span>
                </div>
                <div className={styles.moreItem} onClick={handleShare}>
                    <div className={styles.icon}>
                        <Icon name='PaperClipOutlined' size={20}>
                        </Icon>
                    </div>
                    <span className={styles.text}>
                        复制链接
                    </span>
                </div>
            </div>
          </div>
            <div className={styles.button} >
                    <span className={styles.cancel} onClick={onClose}>
                        取消
                    </span>
            </div>
        </div>
      </Popup>
);

export default React.memo(index);
