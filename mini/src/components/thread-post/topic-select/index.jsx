/**
 * 话题选择
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Input, Button, Icon, ScrollView } from '@discuzq/design';
import styles from './index.module.scss';

@inject('threadPost')
@observer
class TopicSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '', // 搜索关键字
      pageNum: 1,
      pageSize: 20,
      meta: {},
    };
    this.timer = null;
  }

  // 初始化话题请求
  async componentDidMount() {
    const { fetchTopic } = this.props.threadPost;
    await fetchTopic();
    this.setState({ pageNum: this.state.pageNum + 1 });
  }

  // 更新搜索关键字
  updateKeywords = (e) => {
    this.setState({ keywords: e.target.value }, this.searchInput);
  }

  // 搜索话题
  searchInput = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ pageNum: 1 }, this.loadTopics);
    }, 300);
  }

  async loadTopics() {
    // 1 设置参数
    const { fetchTopic } = this.props.threadPost;
    const params = {
      page: this.state.pageNum,
      perPage: this.state.pageSize,
      filter: {
        recommended: 1,
      },
    };
    if (this.state.keywords) {
      params.filter.content = this.state.keywords;
    }
    // 2 发起请求
    await fetchTopic(params);
    // 3 更新页码
    this.setState({ pageNum: this.state.pageNum + 1 });
  }

  onScrollBottom = () => {
    // 忽略页码为1时的触底
    if (this.state.pageNum === 1) return;
    this.loadTopics();
  }

  // 返回发帖页
  cancel = () => {
    Taro.navigateBack();
  }

  // 点击话题，选中项没有话题内容，则采用当前关键字为新话题
  handleItemClick = (item) => {
    const { keywords } = this.state;
    const { postData, setPostData } = this.props.threadPost;
    const topic = `#${item.content || keywords}#`
    const contentText = `${postData.contentText} ${topic}`;
    setPostData({ contentText });
    this.cancel();
  }

  // 渲染项列表
  renderItem = ({ data = [], index }) => {
    const item = data[index] || {};

    return (
      <View
        key={item.id}
        className={styles['topic-item']}
        onClick={() => this.handleItemClick(item)}
      >
        <View className={styles['item-left']}>
          <View className={styles.name}>#{item.content}#</View>
          {item.recommended &&
            <View className={styles.recommend}>
              <Icon name="LikeOutlined" size={20} color='#2469f6' />
            </View>
          }
        </View>
        <View className={styles['item-right']}>{item.viewCount}热度</View>
      </View>
    );
  }

  render() {
    const { topics = [] } = this.props.threadPost;

    return (
      <View className={styles.wrapper}>
        <Input
          value={this.state.keywords}
          icon="SearchOutlined"
          placeholder='搜索话题'
          onChange={e => this.updateKeywords(e)}
        />

        {/* 话题列表 */}
        <View className={styles['topic-wrap']}>
          {/* 新话题 */}
          {this.state.keywords &&
            <View
              className={styles['topic-item']}
              onClick={this.handleItemClick}
            >
              <View className={styles['item-left']}>
                <View className={styles.name}>#{this.state.keywords}#</View>
              </View>
              <View className={styles['item-right']}>新话题</View>
            </View>
          }
          {/* 搜索列表 */}
          <ScrollView
            width='100%'
            height={450}
            rowCount={topics.length}
            rowData={topics}
            rowHeight={54}
            rowRenderer={this.renderItem}
            onScrollBottom={this.onScrollBottom}
            onPullingUp={() => Promise.reject()}
            isRowLoaded={() => true}
          />
        </View>

        {/* 取消按钮 */}
        <View className={styles['btn-container']}>
          <View className={styles.btn}>
            <Button onClick={this.cancel}>取消</Button>
          </View>
        </View>
      </View >
    );
  }
}

export default TopicSelect;
