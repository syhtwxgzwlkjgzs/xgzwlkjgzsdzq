import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';

@inject('user')
@observer
class UserCenterHeaderImage extends React.Component {
  render() {
    const userImageStyle = {}
    let backgroundUrl = this.props.user?.backgroundUrl;
    
    if (this.props.isOtherPerson) {
      backgroundUrl = this.props.user.targetUserBackgroundUrl;
    }

    if (backgroundUrl) {
      Object.assign(userImageStyle, {
        backgroundImage: `url(${backgroundUrl})`
      })
    }

    return (
      <View
        className={styles.box}
        style={userImageStyle}
        {...this.props}
      />
    );
  }
}

export default UserCenterHeaderImage;
