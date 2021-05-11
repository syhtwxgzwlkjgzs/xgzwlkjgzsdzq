import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
@inject('user')
@observer
class UserCenterHeaderImage extends React.Component {
  render() {
    const backgroundUrl = this.props?.user?.backgroundUrl
    return (
            <div className={styles.box} style={{ backgroundImage: backgroundUrl||'url(\'/dzq-img/my-default-header-img.jpg\')' }}/>
    );
  }
}

export default UserCenterHeaderImage;
