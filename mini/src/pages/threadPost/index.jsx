import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import ThemePage from '@components/theme-page';
import { Attachment, Units } from '@components/common';
import { PlusinToolbar, DefaultToolbar, GeneralUpload, Tag, Title, Content } from '@components/thread-post';
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

      uploadType: 0
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

  handlePlusinClick(item) {
    this.setState({
      uploadType: item.type
    });
  }

  render() {
    const { envConfig, theme, changeTheme } = this.props.site;
    const { postData } = this.props.threadPost;
    const {
      title,
      isShowTitle,
      uploadType
    } = this.state;

    return (
      <ThemePage>
        {/* 文本框区域，inclue标题、帖子文字内容等 */}
        <View>
          <Title title={title} show={isShowTitle} onInput={this.onTitleInput} />
          <Content
            value={postData.content}
            onChange={this.onContentChange}
            onFocus={this.onContentFocus}
          />
        </View>

        {/* 插件区域、include图片、附件、语音等 */}
        <View className={styles['plusin']}>

          <GeneralUpload type={uploadType} />

        </View>

        {/* 工具栏区域、include各种插件触发图标、发布等 */}
        <View className={styles['toolbar']}>
          <View className={styles['tag-toolbar']}>
            <Tag content='随机红包\总金额80元\20个' />
            <Tag content='悬赏金额10元' />
          </View>
          <PlusinToolbar clickCb={(item) => {
            this.handlePlusinClick(item);
          }} />
          <DefaultToolbar clickCb={(item) => {
            this.handlePlusinClick(item);
          }} />
        </View>
      </ThemePage >
    );
  }
}

export default Index;
