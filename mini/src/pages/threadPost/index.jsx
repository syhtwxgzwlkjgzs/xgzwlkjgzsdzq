import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import ThemePage from '@components/theme-page';
import Title from '@components/thread-post/title';
import TextArea from '@components/thread-post/content';
import ClassifyPopup from '@components/thread-post/classify-popup';
import CategoryToolbar from '@components/thread-post/category-toolbar';
import DefaultToolbar from '@components/thread-post/default-toolbar';
import Tag from '@components/thread-post/tag';
import styles from './index.module.scss';

@inject('index')
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
      showClassifyPopup: false, // 切换分类弹框show
    }
  }
  componentWillMount() { }

  componentDidMount() {
    this.fetchCategories();
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  fetchCategories() { // 若当前store内分类列表数据为空，则主动发起请求
    const { categories, getReadCategories } = this.props.index;
    if (!categories || (categories && categories?.length === 0)) {
      getReadCategories();
    }
  }

  // handle
  onTitleInput = (title) => {
    const { setPostData } = this.props.threadPost;
    setPostData({ title });
  }

  onContentChange = (contentText) => { // 处理文本框内容
    const { setPostData } = this.props.threadPost;
    setPostData({ contentText });
  }

  onContentFocus = () => {
    // 首次发帖，文本框聚焦时，若标题为空，则此次永久隐藏标题输入
    const { postData } = this.props.threadPost;
    if (this.state.postType === 'post' && postData.title === "") {
      this.setState({ isShowTitle: false })
    }
  }

  onClassifyChange = ({ parent, child }) => { // 设置当前选中分类、分类id
    const { setPostData, setCategorySelected } = this.props.threadPost;
    setPostData({ categoryId: child.pid || parent.pid });
    setCategorySelected({ parent, child });
  }

  render() {
    const { categories } = this.props.index;
    const { envConfig, theme, changeTheme } = this.props.site;
    const { postData } = this.props.threadPost;
    const {
      title,
      isShowTitle,
      showClassifyPopup,
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
        </View>
        <View className={styles['toolbar']}>
          <View className={styles['tag-toolbar']}>
            <Tag content='随机红包\总金额80元\20个' />
            <Tag content='悬赏金额10元' />
          </View>
          <CategoryToolbar
            onCategoryClick={() => this.setState({ showClassifyPopup: true })}
          />
          <DefaultToolbar />
          {/* 二级分类弹框 */}
          <ClassifyPopup
            show={showClassifyPopup}
            category={categories}
            onHide={() => this.setState({ showClassifyPopup: false })}
            onChange={this.onClassifyChange}
          />
        </View>
      </ThemePage >
    );
  }
}

export default Index;
