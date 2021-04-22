import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import ThemePage from '@components/theme-page';
import Title from '@components/thread-post/title';
import TextArea from '@components/thread-post/content';
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
      postType: 'post', // 发布类型 post-首次发帖，edit-再次编辑，draft-草稿
      title: '',
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

  onContentChange = (content) => { // 处理文本框内容
    const { setPostData } = this.props.threadPost;
    setPostData({ content });
  }

  onContentFocus = () => {
    // 首次发帖，文本框聚焦时，若标题为空，则此次永久隐藏标题输入
    const { postData } = this.props.threadPost;
    if (this.state.postType === 'post' && postData.title === "") {
      this.setState({ isShowTitle: false })
    }
  }

  render() {
    const { envConfig, theme, changeTheme } = this.props.site;
    const { postData } = this.props.threadPost;
    const {
      title,
      isShowTitle
    } = this.state;

    return (
      <ThemePage>
        <View>
          <Title title={title} show={isShowTitle} onInput={this.onTitleInput} />
          <TextArea
            value={postData.content}
            onChange={this.onContentChange}
            onFocus={this.onContentFocus}
          />
          {/* <Text className={styles.text}>{envConfig.baseURL}</Text>
          <View className={styles.text}>这是发帖页</View> */}
          <CategoryToolbar />

        </View>
      </ThemePage >
    );
  }
}

export default Index;
