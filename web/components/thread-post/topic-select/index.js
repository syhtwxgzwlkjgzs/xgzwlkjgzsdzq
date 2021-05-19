/**
 * 话题选择弹框组件
 * @prop {boolean} visible 是否显示弹出层
 * @prop {function} clickTopic 选中话题事件,传递当前选择的话题
 * @prop {function} cancelTopic 取消事件
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup, Input, Button, Icon, ScrollView } from '@discuzq/design';
import styles from './index.module.scss';
import DDialog from '@components/dialog';
import PropTypes from 'prop-types';
import BaseList from '@components/list';

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
      loadingText: 'loading',
      isLastPage: false,
    };
    this.timer = null;
  }

  // 清除关键字
  clearKeywords = () => {
    this.setState(
      { keywords: '', checkUser: [], pageNum: 1 },
      () => {
        this.loadTopics();
      },
    );
  }

  // 初始化话题请求
  async componentDidMount() {
    const { fetchTopic } = this.props.threadPost;
    await fetchTopic();
    this.setState({ pageNum: this.state.pageNum + 1 });
  }

  // 更新搜索关键字
  updateKeywords(e) {
    this.setState({ keywords: e.target.value }, this.searchInput);
  }

  // 搜索话题
  searchInput() {
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
      // filter: {
      //   recommended: 1,
      // },
    };
    if (this.state.keywords) {
      params.filter.content = this.state.keywords;
    }
    // 2 发起请求
    const ret = await fetchTopic(params);
    // 3 更新页码
    if (ret.code === 0) {
      this.setState({ pageNum: this.state.pageNum + 1 });
    }
    return Promise.reject();
  }

  onScrollBottom() {
    if ((this.state.pageNum - 1) * this.state.pageSize
      > this.props.threadPost.topicTotalCount) return Promise.reject();
    return this.loadTopics();
  }

  onScrollTop() {
    console.log('top');
  }

  handleItemClick = (item) => {
    const { keywords } = this.state;
    let val = keywords;
    if (item.content) val = item.content;
    this.props.clickTopic(`#${val}#`);
    this.props.cancelTopic();
  }

  renderItem() {
    const { threadPost } = this.props;
    const { topics = [] } = threadPost;
    if (!topics || topics.length === 0) return null;
    return topics.map((item) => (
      <div
        key={item.id}
        className={styles['topic-item']}
        onClick={() => this.handleItemClick(item)}
      >
        <div className={styles['item-left']}>
          <div className={styles.name}>#{item.content}#</div>
          {item.recommended === 1
            && <Icon name="LikeOutlined" />
          }
        </div>
        <div className={styles['item-right']}>{item.viewCount}热度</div>
      </div>
    ));
  }

  render() {
    const { visible = false, cancelTopic } = this.props;
    const content = (
      <div className={styles.wrapper}>
        {/* 搜索框 */}
        <div className={styles.input}>
          <Icon className={styles.inputWrapperIcon} name="SearchOutlined" size={16} />
          <Input
            value={this.state.keywords}
            placeholder='搜索话题'
            onChange={e => this.updateKeywords(e)}
          />
          {this.state.keywords &&
            <Icon className={styles.deleteIcon} name="WrongOutlined" size={16}  onClick={this.clearKeywords}></Icon>
          }
        </div>

        {/* 话题列表 */}
        {/* <div className={styles['topic-wrap']}> */}
          <BaseList className={styles['topic-wrap']} onRefresh={this.onScrollBottom.bind(this)} noMore={(this.state.pageNum - 1) * this.state.pageSize
            > this.props.threadPost.topicTotalCount}>
            {/* 新话题 */}
            {this.state.keywords
              && <div
                className={styles['topic-item']}
                onClick={this.handleItemClick}
              >
                <div className={styles['item-left']}>
                  <div className={styles.name}>#{this.state.keywords}#</div>
                </div>
                <div className={styles['item-right']}>新话题</div>
              </div>
            }
            {/* 搜索列表 */}
            {/* <ScrollView
              width='100%'
              rowCount={topics.length}
              rowData={topics}
              rowHeight={54}
              rowRenderer={this.renderItem.bind(this)}
              onScrollTop={this.onScrollTop.bind(this)}
              onScrollBottom={this.onScrollBottom.bind(this)}
              onPullingUp={() => Promise.reject()}
              isRowLoaded={() => true}
            /> */}
            {this.renderItem()}
          </BaseList>
        {/* </div> */}

        {/* 取消按钮 */}
        <div className='btn-cancel'>
          <Button onClick={cancelTopic}>取消</Button>
        </div>
      </div >
    );
    if (this.props.pc) return (
      <DDialog
        visible={visible}
        className={styles.pc}
        onClose={this.props.cancelTopic}
        title="添加话题"
        isCustomBtn={true}
      >
        {content}
      </DDialog>
    );
    return (
      <Popup
        className={styles.popup}
        position="center"
        visible={visible}
      >
        {content}
      </Popup>
    );
  }
}

TopicSelect.propTypes = {
  visible: PropTypes.bool.isRequired,
  clickTopic: PropTypes.func.isRequired,
  cancelTopic: PropTypes.func.isRequired,
};

export default TopicSelect;
