import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import ThemePage from '@components/theme-page';
import CategoryToolbar from '@components/thread-post/category-toolbar';
import DefaultToolbar from '@components/thread-post/default-toolbar';
import Tag from '@components/thread-post/tag';
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
        <View className={styles['toolbar']}>
          <View className={styles['tag-toolbar']}>
            <Tag content='随机红包\总金额80元\20个' />
            <Tag content='悬赏金额10元' />
          </View>
          <CategoryToolbar />
          <DefaultToolbar />
        </View>
      </ThemePage>
    );
  }
}

export default Index;
