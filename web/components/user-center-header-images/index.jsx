import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
@inject('user')
@observer
class UserCenterHeaderImage extends React.Component {
  render() {
    let backgroundUrl = this.props.user?.backgroundUrl;
    if (this.props.isOtherPerson) {
      backgroundUrl = this.props.user.targetUserBackgroundUrl;
    }

    return (
      <div
        className={styles.box}
        style={{ backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'url(\'/dzq-img/my-default-header-img.jpg\')' }}
        {...this.props}
      />
    );
  }
}

export default UserCenterHeaderImage;
