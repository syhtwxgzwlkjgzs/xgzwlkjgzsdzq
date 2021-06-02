import React from 'react';
import styles from './index.module.scss';
import { Icon, Popup } from '@discuzq/design';
import UserCenterFllows from '@components/user-center-follow';
import { noop } from '@components/thread/utils';
import Router from '@discuzq/sdk/dist/router';
/**
 * 关注弹框
 * @prop {boolean} visible 是否显示弹框
 * @prop {function} onClose 弹框关闭事件
 */
const Index = (props) => {
  const {
    visible = false,
    onClose = noop,
    isOtherFans = false,
    id,
  } = props;
  const onContainerClick = ({ id }) => {
    Router.push({ url: `/my/others?isOtherPerson=${true}&otherId=${id}` });
  };
  return (
    <Popup
      position="center"
      visible={visible}
      onClose={onClose}
    >
      <div className={styles.contaner}>
        <div className={styles.popupWrapper}>
          <div className={styles.title}>
            关注
            <Icon
              name="CloseOutlined"
              className={styles.closeIcon}
              size={12}
              onClick={onClose}
            />
          </div>
          <div className={styles.titleHr}></div>
          {!id ? (
            <UserCenterFllows onContainerClick={onContainerClick} />
          ) : (
            <UserCenterFllows userId={id} onContainerClick={onContainerClick} />
          )}
        </div>
      </div>
    </Popup>);
};

export default React.memo(Index);
