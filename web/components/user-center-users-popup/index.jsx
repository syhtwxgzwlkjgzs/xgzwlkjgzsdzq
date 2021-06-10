import React from 'react';
import styles from './index.module.scss';
import { Icon, Dialog } from '@discuzq/design';
import UserCenterUsers from '@components/user-center-users';
import { noop } from '@components/thread/utils';
import Router from '@discuzq/sdk/dist/router';
import ReactDOM from 'react-dom';

/**
 * 成员弹框
 * @prop {boolean} visible 是否显示弹框
 * @prop {function} onClose 弹框关闭事件
 */
const Index = (props) => {
  const {
    visible = false,
    onClose = noop,
    title = '成员',
    id,
  } = props;
  const onContainerClick = ({ id }) => {
    Router.push({ url: `/user/${id}` });
  };

  const dialogElement =  (
    <Dialog
      position="center"
      visible={visible}
      onClose={onClose}
    >
      <div className={styles.contaner}>
        <div className={styles.popupWrapper}>
          <div className={styles.title}>
            <span>{title}</span>
            <Icon
              name="CloseOutlined"
              className={styles.closeIcon}
              size={12}
              onClick={onClose}
            />
          </div>
          <div className={styles.titleHr}></div>
          {!id ? (
            <UserCenterUsers onContainerClick={onContainerClick} />
          ) : (
            <UserCenterUsers userId={id} onContainerClick={onContainerClick} />
          )}
        </div>
      </div>
    </Dialog>);

  if (typeof window === 'undefined') {
    return dialogElement;
  }

  return ReactDOM.createPortal(dialogElement, document.getElementsByTagName('body')[0]);
};

export default React.memo(Index);
