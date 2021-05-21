import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Input, Avatar, Icon, Checkbox, Button, ScrollView } from '@discuzq/design';
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
      isFollow: true, // 当前列表是否为粉丝
      finish: false, // 粉丝列表加载结束
    };
  }

  componentDidMount() { // 初始化
    this.fetchFollow();
  }

  // 请求粉丝
  async fetchFollow() {
    const { threadPost } = this.props;
    const { page, perPage } = this.state;
    if ((page - 1) * perPage > threadPost.follows.length) {
      this.setState({ finish: true });
      return;
    }
    const ret = await threadPost.fetchFollow({ page, perPage });
    if (ret.code === 0) {
      this.setState({ page: page + 1 });
    }
    return ret;
  }

  // 请求全站用户
  async fetchUserList() {
    const { getUsersList } = this.props.search;
    const { page, perPage, keywords } = this.state;
    const params = { search: keywords, type: 'username', page, perPage };
    const ret = await getUsersList(params);
    if (ret.code === 0) {
      this.setState({ page: page + 1 });
    }
    return ret;
  }

  // 更新搜索关键字,搜索用户
  updateKeywords = (val = "") => {
    this.setState({
      keywords: val,
      checkUser: [],
      page: 1,
      isFollow: val === "",
      finish: false,
    }, () => {
      this.state.isFollow ? this.fetchFollow() : this.fetchUserList();
    });
  }

  onScrollBottom = (e) => {
    const { isFollow, finish, } = this.state;
    if (isFollow && finish) return;
    return isFollow ? this.fetchFollow() : this.fetchUserList();
  }

  // 取消选择
  handleCancel = () => {
    Taro.navigateBack();
  };

  // 确认选择
  submitSelect = () => {
    const { checkUser, isFollow } = this.state;
    // 未选@人，不操作
    if (checkUser.length === 0) return;

    // 处理已选@ren，更新store
    const { postData, setPostData } = this.props.threadPost;
    const at = checkUser.map(item => `@${isFollow ? item.user.userName : item.nickname} `).join();
    const contentText = `${postData.contentText} ${at}`;
    setPostData({ contentText });

    // 返回发帖页
    this.handleCancel();
  }

  // 获取显示文字头像的背景色
  getBackgroundColor = (name) => {
    const character = name ? name.charAt(0).toUpperCase() : "";
    return stringToColor(character);
  }

  // 渲染列表内容
  renderItem = (item) => {
    const isFollow = this.state.keywords === "";
    const avatar = isFollow ? item?.user?.avatar : item.avatar;
    const username = isFollow ? item?.user?.userName : item.nickname;
    const groupName = isFollow ? item?.group?.groupName : item.groupName;

    return (
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
        <Checkbox name={item}></Checkbox>
      </View>
    );
  }

  render() {
    const { keywords, checkUser, isFollow } = this.state;
    const { threadPost: { follows }, search: { users } } = this.props;
    const data = isFollow ? (follows || []) : (users?.pageData || []);

    return (
      <View className={styles.wrapper}>
        {/* 搜索框 */}
        <View className={styles['input-box']}>
          <Input
            value={keywords}
            icon="SearchOutlined"
            placeholder='搜索用户'
            onChange={e => throttle(this.updateKeywords(e.target.value), 30)}
          />
          {keywords &&
            <View className={styles.delete} onClick={() => this.updateKeywords()}>
              <Icon className={styles['delete-icon']} name="CloseOutlined" size={12}></Icon>
            </View>
          }
        </View>
        {/* 选择列表 */}
        <Checkbox.Group
          className={styles['check-box']}
          value={checkUser}
          onChange={val => this.setState({ checkUser: val })}
        >
          <List
            height={'calc(100vh - 120px)'}
            noMore={false}
            onRefresh={this.onScrollBottom}
            allowRefresh={false}
          >
            {data.map(item => {
              return (
                <View key={item}>
                  {this.renderItem(item)}
                </View>
              )
            })
            }
          </List>
        </Checkbox.Group>

        {/* 取消按钮 */}
        <View className={styles['btn-container']}>
          <View className={styles.btn}>
            <Button onClick={this.handleCancel}>取消</Button>
            <Button
              className={checkUser.length > 0 ? styles.selected : ''}
              onClick={() => this.submitSelect()}
            >
              {checkUser.length ? `@ 已选(${checkUser.length})` : '尚未选'}
            </Button>
          </View>
        </View>
      </View >
    );
  }
}

export default AtSelect;
