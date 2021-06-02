import React from 'react';
import styles from './index.module.scss';
import { Icon, Popup, Divider } from '@discuzq/design';
import UserCenterFans from '@components/user-center-fans';
import { noop } from '@components/thread/utils';
import Router from '@discuzq/sdk/dist/router';

/**
 * 粉丝弹框
 * @prop {boolean} visible 是否显示弹框
 * @prop {function} onClose 弹框关闭事件
 */
const Index = (props) => {
  const { visible = false, onClose = noop, isOtherFans = false, id } = props;
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

  return (
    <Popup position="center" visible={visible} onClose={onClose}>
      <div className={styles.contaner}>
        <div className={styles.popupWrapper}>
          <div className={styles.title}>
            粉丝
            <Icon name="CloseOutlined" className={styles.closeIcon} size={12} onClick={onClose} />
          </div>
          <div className={styles.titleHr}></div>
          {!id ? (
            <UserCenterFans onContainerClick={onContainerClick} splitElement={splitElement} />
          ) : (
            <UserCenterFans userId={id} onContainerClick={onContainerClick} splitElement={splitElement} />
          )}
        </div>
      </div>
    </Popup>
  );
};

export default React.memo(Index);
