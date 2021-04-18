/**
 * at选择弹框组件。默认展示相互关注人员，搜索关键字按照站点全体人员查询
 * @prop {array} data 数据
 * @prop {boolean} visible 是否显示弹出层
 * @prop {function} onSearch 搜索事件
 * @prop {function} onCancel 取消
 * @prop {function} getAtList 确定
 * @prop {function} onScrollTop 触顶事件
 * @prop {function} onScrollBottom 触底事件
 */
import React, { Component } from 'react';
import { Popup, Input, Checkbox, Button, ScrollView } from '@discuzq/design';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

class AtSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '', // 搜索关键字
      checkUser: [], // 当前选择的at人
    }
    this.timer = null;
  }

  // 更新搜索关键字,搜索用户
  updateKeywords(e) {
    const keywords = e.target.value
    this.setState({ keywords });
    this.searchInput(keywords);
  }

  // 搜索用户
  searchInput(keywords) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.onSearch(keywords);
    }, 300);
  }

  onScrollTop() {
    console.log('top');
    this.props.onScrollTop();
  }

  onScrollBottom() {
    console.log('bottom')
    this.props.onScrollBottom();
  }

  // 确认选择
  submitSelect() {
    if (this.state.checkUser.length === 0) { return }
    this.props.getAtList(this.state.checkUser)
  }

  renderItem(info) {
    const { data, index } = info;
    const item = data[index] || {};

    return (
      <div className={styles['at-item']}>
        <div className={styles.avatar}>
          <img className={styles.image} src={item?.user?.avatarUrl || '/noavatar.gif'} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.username}>{item?.user?.userName}</div>
          <div className={styles.group}>{item?.group?.groupName}</div>
        </div>
        <Checkbox name={item}></Checkbox>
      </div>
    )
  }

  render() {
    const {
      data,
      visible,
      onCancel,
      getAtList,
    } = this.props;

    return (
      <Popup
        className={`${styles.popup}`}
        position="center"
        visible={visible}
      >
        <div className={styles.wrapper}>
          {/* 搜索框 */}
          <Input
            value={this.state.keywords}
            icon="SearchOutlined"
            placeholder='搜索用户'
            onChange={(e) => this.updateKeywords(e)}
          />

          {/* 选择列表 */}
          <Checkbox.Group
            value={this.state.checkUser}
            onChange={(val) => this.setState({ checkUser: val })}
          >
            <div className={styles['at-wrap']}>
              <ScrollView
                width='100%'
                rowCount={data.length}
                rowData={data}
                rowHeight={54}
                rowRenderer={this.renderItem.bind(this)}
                onScrollTop={this.onScrollTop.bind(this)}
                onScrollBottom={this.onScrollBottom.bind(this)}
                onPullingUp={() => Promise.reject()}
                isRowLoaded={() => true}
              />
            </div>
          </Checkbox.Group>

          {/* 取消按钮 */}
          <div className={styles.btn}>
            <Button className='btn-cancel' onClick={onCancel}>取消</Button>
            <Button
              className={this.state.checkUser.length > 0 ? 'is-selected' : 'not-selected'}
              onClick={() => this.submitSelect()}
            >
              {this.state.checkUser.length ? `@ 已选(${this.state.checkUser.length})` : '尚未选'}
            </Button>
          </div>
        </div >
      </Popup>
    )
  }
}

AtSelect.propTypes = {
  data: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  getAtList: PropTypes.func.isRequired,
  onScrollTop: PropTypes.func,
  onScrollBottom: PropTypes.func,
}

AtSelect.defaultProps = {
  data: [],
  visible: false,
  onSearch: () => { console.log('@组件未添加取消事件') },
  onCancel: () => { console.log('@组件未添加取消事件') },
  getAtList: () => { console.log('@组件未添加已选列表处理事件') },
  onScrollTop: () => { console.log('@组件未添加触顶事件') },
  onScrollBottom: () => { console.log('@组件未添加触底事件') },
}

export default AtSelect;
