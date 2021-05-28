/**
 * 话题选择弹框组件
 * @prop {boolean} visible 是否显示弹出层
 * @prop {function} clickTopic 选中话题事件,传递当前选择的话题
 * @prop {function} cancelTopic 取消事件
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup, Input, Icon, Toast } from '@discuzq/design';
import styles from './index.module.scss';
import PropTypes from 'prop-types';

import List from '@components/list';
import DDialog from '@components/dialog';

@inject('threadPost')
@observer
class TopicSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '', // 搜索关键字
      page: 1,
      perPage: 20,
      finish: false,
    };
    this.timer = null;
  }

  // 初始化话题请求
  async componentDidMount() {
    this.fetchTopics();
  }

  // 更新搜索关键字
  updateKeywords = (val = "") => {
    this.setState({ keywords: val, page: 1 });
    this.searchInput();
  }

  // 搜索话题
  searchInput = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchTopics();
    }, 300);
  }

  // 请求
  async fetchTopics() {
    // 1 设置参数
    const { fetchTopic } = this.props.threadPost;
    const { page, perPage, keywords } = this.state;
    const params = { page, perPage };
    if (keywords) {
      params.filter = {};
      params.filter.content = keywords;
    }
    // 2 发起请求
    const ret = await fetchTopic(params);
    const { code, data } = ret;
    // 3 请求完成
    if (code === 0) {
      this.setState({
        page: page + 1,
        finish: page >= data.totalPage
      });
    } else {
      this.setState({ finish: true });
      Toast.error({ content: ret.msg });
    }
  }

  handleItemClick = (item) => {
    const topic = ` #${item.content}# `;
    this.props.clickTopic(topic);
    this.props.cancelTopic();
  }

  // 渲染项
  renderItem = (item) => (
    <div className={styles['topic-item']} onClick={() => this.handleItemClick(item)}>
      <div className={styles['item-left']}>
        <div className={styles.name}>#{item.content}#</div>
      </div>
      <div className={styles['item-right']}>
        {item.newTopic ? item.newTopic : `${item.viewCount}热度`}
      </div>
    </div>
  );

  render() {
    const { pc, visible = false, cancelTopic, threadPost } = this.props;
    const { topics = [] } = threadPost;
    const { finish, keywords } = this.state;

    const content = (
      <div className={styles.wrapper}>

        {/* top */}
        <div className={styles.header}>
          <div className={styles['input-box']}>
            <Input
              value={keywords}
              icon="SearchOutlined"
              placeholder='请选择或直接输入话题'
              onChange={e => this.updateKeywords(e.target.value)}
            />
            {!pc && keywords &&
              <div className={styles.delete} onClick={() => this.updateKeywords()}>
                <Icon className={styles['delete-icon']} name="WrongOutlined" size={16}></Icon>
              </div>
            }
          </div>
          {!pc &&
            <div className={styles['btn-cancel']} onClick={cancelTopic}>取消</div>
          }
        </div>

        {/* list */}
        <List
          className={styles.list}
          wrapperClass={styles['list__inner']}
          height={pc ? 'auto' : 'calc(100vh - 50px)'}
          noMore={finish}
          onRefresh={() => this.fetchTopics()}
        >
          {keywords && this.renderItem({ content: keywords, newTopic: '新话题' })}
          {topics.map(item => (
            <React.Fragment key={item.topicId}>
              {this.renderItem(item)}
            </React.Fragment>
          ))}
        </List>
      </div >
    );

    if (pc) return (
      <DDialog
        visible={visible}
        className={styles.pc}
        onClose={cancelTopic}
        title="#添加话题#"
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
