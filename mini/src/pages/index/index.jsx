import React, { Component } from 'react';
import { View, Button, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import ThemePage from '@components/theme-page';
import { APP_THEME } from '@common/constants/site';
import './index.scss';

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
        <View className='index'>
          <Text className='text'>{envConfig.baseURL}</Text>
          <View className='text'>{theme}</View>
          <Button onClick={() => {
            changeTheme(theme === APP_THEME.light ? APP_THEME.dark : APP_THEME.light);
          }}>修改主题</Button>
        </View>
      </ThemePage>
    );
  }
}

export default Index;
