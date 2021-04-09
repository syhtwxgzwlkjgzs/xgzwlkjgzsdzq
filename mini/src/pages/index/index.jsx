import React, { Component } from 'react';
import { View, Button, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import ThemePage from '@components/theme-page';
import { APP_THEME } from '@common/constants/site';
import styles from './index.module.scss';

@inject('site')
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
          <Text className={styles.text}>{envConfig.baseURL}</Text>
          <View className={styles.text}>{theme}</View>
          <Button onClick={() => {
            changeTheme(theme === APP_THEME.light ? APP_THEME.dark : APP_THEME.light);
          }}>修改主题</Button>
        </View>
      </ThemePage>
    );
  }
}

export default Index;
