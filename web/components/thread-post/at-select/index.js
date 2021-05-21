/**
 * at选择弹框组件。默认展示相互关注人员，搜索关键字按照站点全体人员查询
 * @prop {array} data 数据
 * @prop {boolean} visible 是否显示弹出层
 * @prop {function} onCancel 取消
 * @prop {function} getAtList 确定
 */
import React, { Component } from 'react';
import { Popup, Input, Checkbox, Avatar, Button, ScrollView, Icon, Toast } from '@discuzq/design';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import DDialog from '@components/dialog';
import BaseList from '@components/list';

import stringToColor from '@common/utils/string-to-color';

@inject('threadPost')
@inject('search')
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
    const { page, perPage } = this.state;
    const params = { page, perPage };
    if (page === 1) this.setState({ checkUser: [], finish: false });
    const ret = await threadPost.fetchFollow(params);
    if (ret.code === 0) {
      this.setState({
        page: page + 1,
        finish: (this.state.page - 1) * this.state.perPage > threadPost.followsTotalCount,
      });
    } else {
      Toast.error({ content: ret.msg });
    }
    return ret;
  }

  async fetchAllUser() {
    const { search } = this.props;
    const { page, perPage, keywords } = this.state;
    if (page === 1) this.setState({ checkUser: [], finish: false });
    const ret = await search.getUsersList({ search: keywords, page, perPage });
    if (ret.code === 0) {
      this.setState({
        page: page + 1,
        finish: (this.state.page - 1) * this.state.perPage > search.users?.totalCount,
      });
    } else {
      Toast.error({ content: ret.msg });
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
      this.fetchAllUser();
    }, 300);
  }

  onScrollBottom() {
    return this.state.keywords ? this.fetchAllUser() : this.fetchFollow();
  }

  // 确认选择
  submitSelect() {
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

  formatData = (item) => {
    const userName = this.state.keywords ? item.nickname : item.user?.userName || '';
    const userId = this.state.keywords ? item.userId : item.user?.pid || '';
    const groupName = this.state.keywords ? item.groupName : item.group?.groupName;
    const avatar = this.state.keywords ? item.avatar : item.user?.avatar;
    return { userName, userId, groupName, avatar };
  }

  renderItem() {
    const { threadPost, search } = this.props;
    const data = this.state.keywords ? (search.users?.pageData || []) : (threadPost.follows || []);

    if (data.length === 0) return null;
    return data.map((item) => {
      const reItem = this.formatData(item);
      return (
        <div className={styles['at-item']} key={reItem.userId}>
          <div className={styles.avatar}>
            {reItem.avatar
              ? <Avatar image={reItem.avatar} />
              : <Avatar
                text={reItem.userName}
                style={{
                  backgroundColor: `#${this.getBackgroundColor(reItem.userName)}`,
                }}
              />
            }
          </div>
          <div className={styles.info}>
            <div className={styles.username}>{reItem.userName}</div>
            <div className={styles.group}>{reItem.groupName}</div>
          </div>
          <Checkbox name={reItem.userName}></Checkbox>
        </div>
      );
    });
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible } = this.props;

    const content = (
      <div className={styles.wrapper}>
        {/* 搜索框 */}
        <div className={styles.input}>
          <Icon className={styles.inputWrapperIcon} name="SearchOutlined" size={16} />
          <Input
            value={this.state.keywords}
            placeholder='搜索用户'
            onChange={e => this.updateKeywords(e)}
          />
          {this.state.keywords &&
            <Icon className={styles.deleteIcon} name="WrongOutlined" size={16}  onClick={this.clearKeywords}></Icon>
          }
        </div>

        {/* 选择列表 */}
          <Checkbox.Group
            value={this.state.checkUser}
            onChange={val => this.setState({ checkUser: val })}
          >
            {/* <div className={styles['at-wrap']}> */}
              {/* <ScrollView
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
              /> */}
            {/* </div> */}
            <BaseList className={styles['at-wrap']} onRefresh={this.onScrollBottom.bind(this)} noMore={this.state.finish}>
              { this.renderItem() }
            </BaseList>
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
        isCustomBtn={true}
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
