import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Page from '@components/page';
import { PlusinToolbar, DefaultToolbar, GeneralUpload, Tag, Title, Content, ClassifyPopup } from '@components/thread-post';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';

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
      uploadType: 0,
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

  handlePlusinClick(item) {
    this.setState({
      uploadType: item.type
    });

    switch (item.type) {
      //  其它类型可依次补充
      case 107:
        this.toSelectReward();
        break;
    }
  }

  toSelectReward = () => { // 跳转悬赏选择页
    Taro.navigateTo({
      url: '/pages/threadPost/selectReward'
    })
  }

  rewardContent = () => { // 悬赏内容
    const { rewardQa: { price, expiredAt } } = this.props.threadPost.postData;
    return (price && expiredAt) ? `悬赏金额${price}元\\结束时间${expiredAt}` : ''
  }

  render() {
    const { categories } = this.props.index;
    const { envConfig, theme, changeTheme } = this.props.site;
    const { postData } = this.props.threadPost;
    const {
      title,
      isShowTitle,
      showClassifyPopup,
      uploadType,
    } = this.state;

    return (
      <Page isLogin>
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
            <Tag
              content={this.rewardContent()}
              clickCb={this.toSelectReward}
            />
          </View>
          <PlusinToolbar
            clickCb={(item) => {
              this.handlePlusinClick(item);
            }}
            onCategoryClick={() => this.setState({ showClassifyPopup: true })}
          />
          <DefaultToolbar clickCb={(item) => {
            this.handlePlusinClick(item);
          }} />


          {/* 二级分类弹框 */}
          <ClassifyPopup
            show={showClassifyPopup}
            category={categories}
            onHide={() => this.setState({ showClassifyPopup: false })}
            onChange={this.onClassifyChange}
          />
        </View>
      </Page>
    );
  }
}

export default Index;
