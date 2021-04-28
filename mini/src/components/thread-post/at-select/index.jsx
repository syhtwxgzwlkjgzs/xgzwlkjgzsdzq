import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Input, Avatar, Checkbox, Button, ScrollView } from '@discuzq/design';
import styles from './index.module.scss';

import stringToColor from '@common/utils/string-to-color';

@inject('threadPost')
@observer
class AtSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '', // 搜索关键字
      checkUser: [], // 当前选择的at用户列表
      page: 1,
      perPage: 10,
      finish: false,
    };
    this.timer = null;
  }

  componentDidMount() { // 初始化
    this.fetchFollow();
  }

  async fetchFollow() { // 请求
    const { threadPost } = this.props;
    const { page, perPage, keywords } = this.state;
    if ((page - 1) * perPage > threadPost.follows.length) {
      this.setState({ finish: true });
      return;
    }
    const params = { page, perPage };
    if (keywords) {
      params.filter = {};
      params.filter.userName = keywords;
      params.filter.type = 0;
    }
    const ret = await threadPost.fetchFollow(params);
    if (ret.code === 0) {
      this.setState({ page: page + 1 });
    }
  }

  // 更新搜索关键字,搜索用户
  updateKeywords = (e) => {
    const keywords = e.target.value;
    this.setState({ keywords, checkUser: [], page: 1 });
    this.searchInput();
  }

  // 搜索用户
  searchInput = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchFollow();
    }, 300);
  }

  onScrollBottom = () => {
    this.fetchFollow();
  }

  // 取消选择
  handleCancel = () => {
    Taro.navigateBack();
  };

  // 确认选择
  submitSelect = () => {
    const { checkUser } = this.state;
    // 未选@人，不操作
    if (checkUser.length === 0) {
      return;
    }

    // 处理已选@ren，更新store
    const { postData, setPostData } = this.props.threadPost;
    const at = checkUser.map(item => `@${item.user.userName}`).join(' ');
    const contentText = `${postData.contentText} ${at}`;
    setPostData({ contentText });

    // 返回发帖页
    this.handleCancel();
  }

  // 获取显示文字头像的背景色
  getBackgroundColor = (name) => {
    const character = name.charAt(0).toUpperCase()
    return stringToColor(character);
  }

  // 渲染列表内容
  renderItem = (info) => {
    const { data, index } = info;
    const item = data[index] || {};
    const username = item.user?.userName || '';

    return (
      <View className={styles['at-item']}>
        <View className={styles.avatar}>
          {item?.user?.avatar
            ? <Avatar image={item.user.avatar} />
            : <Avatar
                text={username}
                style={{
                  backgroundColor: `#${this.getBackgroundColor(username)}`
                }}
              />
          }
        </View>
        <View className={styles.info}>
          <View className={styles.username}>{username}</View>
          <View className={styles.group}>{item?.group?.groupName}</View>
        </View>
        <Checkbox name={item}></Checkbox>
      </View>
    );
  }

  render() {
    const { keywords, checkUser } = this.state;
    const { follows = [] } = this.props.threadPost;

    return (
      <View className={styles.wrapper}>
        {/* 搜索框 */}
        <Input
          value={keywords}
          icon="SearchOutlined"
          placeholder='搜索用户'
          onChange={e => this.updateKeywords(e)}
        />
        {/* 选择列表 */}
        <Checkbox.Group
          value={checkUser}
          onChange={val => this.setState({ checkUser: val })}
        >
          <View className={styles['at-wrap']}>
            <ScrollView
              width='100%'
              height={475}
              rowCount={follows.length}
              rowData={follows}
              rowHeight={54}
              rowRenderer={this.renderItem}
              onScrollBottom={this.onScrollBottom}
              onPullingUp={() => Promise.reject()}
              isRowLoaded={() => true}
              lowerThreshold={10}
            />
          </View>
        </Checkbox.Group>

        {/* 取消按钮 */}
        <View className={styles.btn}>
          <Button onClick={this.handleCancel}>取消</Button>
          <Button
            className={checkUser.length > 0 ? 'is-selected' : 'not-selected'}
            onClick={() => this.submitSelect()}
          >
            {checkUser.length ? `@ 已选(${checkUser.length})` : '尚未选'}
          </Button>
        </View>
      </View >
    );
  }
}

export default AtSelect;
