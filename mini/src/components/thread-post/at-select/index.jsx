import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import Input from '@discuzq/design/dist/components/input/index';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Checkbox from '@discuzq/design/dist/components/checkbox/index';
import Button from '@discuzq/design/dist/components/button/index';
import styles from './index.module.scss';

import List from '@components/list';
import throttle from '@common/utils/thottle';

import stringToColor from '@common/utils/string-to-color';

@inject('threadPost')
@inject('search')
@observer
class AtSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '', // 搜索关键字
      checkUser: [], // 当前选择的at用户列表
      page: 1,
      perPage: 20,
      finish: false, // 粉丝列表加载结束
    };
    this.timer = null;
  }

  componentDidMount() { // 初始化
    this.fetchFollow();
  }

  // 请求粉丝
  async fetchFollow() {
    const { threadPost } = this.props;
    const { page, perPage } = this.state;
    const ret = await threadPost.fetchFollow({ page, perPage });
    if (ret?.code === 0) {
      this.setState({
        page: page + 1,
        finish: page * perPage >= threadPost.followsTotalCount,
      });
    } else {
      this.setState({ finish: true })
      Taro.showToast({ title: ret.msg, icon: 'none' })
    }
  }

  // 请求全站用户
  async fetchUserList() {
    const { getUsersList } = this.props.search;
    const { page, perPage, keywords } = this.state;
    const params = { search: keywords, type: 'username', page, perPage };
    const ret = await getUsersList(params);
    const { code, data } = ret;
    if (code === 0) {
      this.setState({
        page: page + 1,
        finish: page * perPage >= data?.totalCount,
      });
    } else {
      this.setState({ finish: true });
      Taro.showToast({ title: ret.msg, icon: 'none' })
    }
  }

  // 更新搜索关键字,搜索用户
  updateKeywords = (val = "") => {
    this.setState({
      keywords: val,
      checkUser: [],
      page: 1,
    });
    this.searchInput();
  }

  // 搜索用户
  searchInput() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.state.keywords === '' ? this.fetchFollow() : this.fetchUserList();
    }, 300);
  }

  onScrollBottom = () => {
    return this.state.keywords === '' ? this.fetchFollow() : this.fetchUserList();
  }

  // 取消选择
  handleCancel = () => {
    Taro.navigateBack();
  };

  // 确认选择
  submitSelect = () => {
    const { checkUser } = this.state;
    // 未选@人，不操作
    if (checkUser.length === 0) return;

    // 处理已选@ren，更新store
    const { postData: { contentText: text }, setPostData, cursorPosition, setCursorPosition } = this.props.threadPost;
    const at = checkUser.map(item => `@${item} `).join(" ");
    const contentText = text.slice(0, cursorPosition) + at + text.slice(cursorPosition);
    setPostData({ contentText });
    setCursorPosition(cursorPosition + at.length);

    // 返回发帖页
    this.handleCancel();
  }

  // 获取显示文字头像的背景色
  getBackgroundColor = (name) => {
    const character = name ? name.charAt(0).toUpperCase() : "";
    return stringToColor(character);
  }

  formatData = (item) => {
    const isFollow = this.state.keywords === '';
    const avatar = isFollow ? item?.user?.avatar : item.avatar;
    const username = isFollow ? item?.user?.userName : item.nickname;
    const groupName = isFollow ? item?.group?.groupName : item.groupName;
    const userId = isFollow ? item.user?.pid : item.userId;
    return { avatar, username, groupName, userId };
  }

  // 渲染列表内容
  renderItem() {
    const { threadPost, search } = this.props;
    const data = this.state.keywords ? (search?.users?.pageData || []) : (threadPost.follows || []);

    return data.map(item => {
      const { avatar, username, groupName, userId } = this.formatData(item);

      return (
        <View key={userId}>
          <View className={styles['at-item']}>
            <View className={styles.avatar}>
              {avatar
                ? <Avatar image={avatar} />
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
              <View className={styles.group}>{groupName}</View>
            </View>
            <Checkbox name={username}></Checkbox>
          </View>
        </View>
      )
    })
  }

  render() {
    const { keywords, checkUser, finish } = this.state;

    return (
      <View className={styles.wrapper}>
        {/* top*/}
        <View className={styles.header}>
          <View className={styles['input-box']}>
            <Input
              value={keywords}
              icon="SearchOutlined"
              placeholder='搜索用户'
              onChange={e => throttle(this.updateKeywords(e.target.value), 30)}
            />
            {keywords &&
              <View className={styles.delete} onClick={() => this.updateKeywords()}>
                <Icon className={styles['delete-icon']} name="WrongOutlined" size={16}></Icon>
              </View>
            }
          </View>
          <View className={styles['btn-cancel']} onClick={this.handleCancel}>取消</View>
        </View>

        {/* list */}
        <Checkbox.Group
          className={styles['check-box']}
          value={checkUser}
          onChange={val => this.setState({ checkUser: val })}
        >
          <List
            height={'calc(100vh - 120px)'}
            noMore={finish}
            onRefresh={this.onScrollBottom}
          >
            {this.renderItem()}
          </List>
        </Checkbox.Group>

        {/* 选择按钮 */}
        <View className={styles['btn-container']}>
          <Button
            className={checkUser.length > 0 ? styles.selected : ''}
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
