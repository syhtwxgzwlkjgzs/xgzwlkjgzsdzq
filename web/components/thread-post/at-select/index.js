/**
 * at选择弹框组件。默认展示相互关注人员，搜索关键字按照站点全体人员查询
 * @prop {array} data 数据
 * @prop {boolean} visible 是否显示弹出层
 * @prop {function} onCancel 取消
 * @prop {function} getAtList 确定
 */
import React, { Component } from 'react';
import { Popup, Input, Checkbox, Avatar, Button, ScrollView, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DDialog from '@components/dialog';

import stringToColor from '@common/utils/string-to-color';

@inject('threadPost')
@observer
class AtSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '', // 搜索关键字
      checkUser: [], // 当前选择的at人
      page: 1,
      perPage: 10,
      finish: false,
    };
    this.timer = null;
  }

  componentDidMount() {
    this.fetchFollow();
  }

  async fetchFollow() {
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
  updateKeywords(e) {
    const keywords = e.target.value;
    this.setState({ keywords, page: 1 });
    this.searchInput();
  }

  // 搜索用户
  searchInput() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchFollow();
    }, 300);
  }

  onScrollBottom() {
    // 没有更多数据时，不再发送请求
    if (this.state.finish) return;
    this.fetchFollow();
  }

  // 确认选择
  submitSelect() {
    console.log(this.state.checkUser);
    if (this.state.checkUser.length === 0) {
      return;
    }
    this.props.getAtList(this.state.checkUser);
    this.props.onCancel();
  }

  // 获取显示文字头像的背景色
  getBackgroundColor = (name) => {
    const character = name.charAt(0).toUpperCase()
    return stringToColor(character);
  }

  // 清除关键字
  clearKeywords = () => {
    this.setState(
      { keywords: '', checkUser: [], page: 1 },
      () => this.fetchFollow()
    );
  }

  renderItem(info) {
    const { data, index } = info;
    const item = data[index] || {};
    const username = item.user?.userName || '';

    return (
      <div className={styles['at-item']}>
        <div className={styles.avatar}>
          {item?.user?.avatar
            ? <Avatar image={item.user.avatar} />
            : <Avatar
              text={username}
              style={{
                backgroundColor: `#${this.getBackgroundColor(username)}`
              }}
            />
          }
        </div>
        <div className={styles.info}>
          <div className={styles.username}>{item?.user?.userName}</div>
          <div className={styles.group}>{item?.group?.groupName}</div>
        </div>
        <Checkbox name={item}></Checkbox>
      </div>
    );
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, threadPost } = this.props;
    const data = threadPost.follows || [];
    const content = (
      <div className={styles.wrapper}>
        {/* 搜索框 */}
        <div className={styles.input}>
          <Input
            value={this.state.keywords}
            icon="SearchOutlined"
            placeholder='搜索用户'
            onChange={e => this.updateKeywords(e)}
          />
          {this.state.keywords &&
            <div className={styles.delete} onClick={this.clearKeywords}>
              <Icon className={styles['delete-icon']} name="CloseOutlined" size={8} color='#f2f4f5'></Icon>
            </div>
          }
        </div>

        {/* 选择列表 */}
        <Checkbox.Group
          value={this.state.checkUser}
          onChange={val => this.setState({ checkUser: val })}
        >
          <div className={styles['at-wrap']}>
            <ScrollView
              className={styles['scroll-view']}
              width='100%'
              rowCount={data.length}
              rowData={data}
              rowHeight={54}
              rowRenderer={this.renderItem.bind(this)}
              onScrollBottom={this.onScrollBottom.bind(this)}
              onPullingUp={() => Promise.reject()}
              isRowLoaded={() => true}
              lowerThreshold={100}
            />
          </div>
        </Checkbox.Group>

        {/* 取消按钮 */}
        <div className={styles.btn}>
          <Button onClick={this.handleCancel}>取消</Button>
          <Button
            className={this.state.checkUser.length > 0 ? 'is-selected' : 'not-selected'}
            onClick={() => this.submitSelect()}
          >
            {this.state.checkUser.length ? `@ 已选(${this.state.checkUser.length})` : '尚未选'}
          </Button>
        </div>
      </div >
    );

    if (this.props.pc) return (
      <DDialog
        visible={this.props.visible}
        className={styles.pc}
        onClose={this.handleCancel}
        title="@圈友"
      >
        {content}
      </DDialog>
    );

    return (
      <Popup
        className={`${styles.popup}`}
        position="center"
        visible={visible}
      >
        {content}
      </Popup>
    );
  }
}

AtSelect.propTypes = {
  data: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  getAtList: PropTypes.func.isRequired,
};

AtSelect.defaultProps = {
  data: [],
  visible: false,
  onCancel: () => {},
  getAtList: () => {},
};

export default AtSelect;
