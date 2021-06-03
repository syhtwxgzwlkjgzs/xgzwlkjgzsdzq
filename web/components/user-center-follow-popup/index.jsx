import React from 'react';
import styles from './index.module.scss';
import { Icon, Dialog, Divider } from '@discuzq/design';
import UserCenterFllows from '@components/user-center-follow';
import { noop } from '@components/thread/utils';
import Router from '@discuzq/sdk/dist/router';
import ReactDOM from 'react-dom';

/**
 * 关注弹框
 * @prop {boolean} visible 是否显示弹框
 * @prop {function} onClose 弹框关闭事件
 */
const Index = (props) => {
  const { visible = false, onClose = noop, isOtherFans = false, id, title = '关注' } = props;
  const onContainerClick = ({ id }) => {
    Router.push({ url: `/user/${id}` });
  };

  const splitElement = React.useMemo(
    () => (
      <div className={styles.splitEmelent}>
        <Divider />
      </div>
    ),
    [],
  );

  const dialogElement = (
    <Dialog position="center" visible={visible} onClose={onClose}>
      <div className={styles.contaner}>
        <div className={styles.popupWrapper}>
          <div className={styles.title}>
            {title}
            <Icon name="CloseOutlined" className={styles.closeIcon} size={12} onClick={onClose} />
          </div>
          <div className={styles.titleHr}></div>
          {!id ? (
            <UserCenterFllows
              styles={{
                height: 'calc(100% - 60px)',
              }}
              onContainerClick={onContainerClick}
              splitElement={splitElement}
            />
          ) : (
            <UserCenterFllows
              styles={{
                height: 'calc(100% - 60px)',
              }}
              userId={id}
              onContainerClick={onContainerClick}
              splitElement={splitElement}
            />
          )}
        </div>
      </div>
    </Dialog>
  );

  if (typeof window === 'undefined') {
    return dialogElement;
  }

  return ReactDOM.createPortal(dialogElement, document.getElementsByTagName('body')[0]);
};

export default React.memo(Index);
