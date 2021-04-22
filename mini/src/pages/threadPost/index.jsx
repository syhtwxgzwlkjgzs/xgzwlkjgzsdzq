import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import ThemePage from '@components/theme-page';
import CategoryToolbar from '@components/thread-post/category-toolbar';
import { APP_THEME } from '@common/constants/site';
import styles from './index.module.scss';

@inject('site')
@inject('threadPost')
@observer
class Index extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { envConfig, theme, changeTheme } = this.props.site;

    return (
      <ThemePage>
        <View>
          {/* <Text className={styles.text}>{envConfig.baseURL}</Text>
          <View className={styles.text}>这是发帖页</View> */}
          <CategoryToolbar />

        </View>
      </ThemePage>
    );
  }
}

export default Index;
