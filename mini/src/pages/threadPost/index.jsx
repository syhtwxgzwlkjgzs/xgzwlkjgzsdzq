import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import ThemePage from '@components/theme-page';
import Title from '@components/thread-post/title';
import CategoryToolbar from '@components/thread-post/category-toolbar';
import { APP_THEME } from '@common/constants/site';
import styles from './index.module.scss';

@inject('site')
@inject('threadPost')
@observer
class Index extends Component {
  constructor() {
    super();
    this.state = {
      title: '', // 回显标题
      isShowTitle: true, // 默认显示标题
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // handle
  onTitleInput = (title) => {
    const { setPostData } = this.props.threadPost;
    setPostData({ title });
  }

  render() {
    const { envConfig, theme, changeTheme } = this.props.site;
    const {
      title,
      isShowTitle
    } = this.state;

    return (
      <ThemePage>
        <View>
          <Title title={title} show={isShowTitle} onInput={this.onTitleInput} />

          {/* <Text className={styles.text}>{envConfig.baseURL}</Text>
          <View className={styles.text}>这是发帖页</View> */}
          <CategoryToolbar />

        </View>
      </ThemePage>
    );
  }
}

export default Index;
