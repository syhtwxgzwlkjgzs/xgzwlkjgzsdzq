/**
 * 左滑列表、列表项组件
*/
import React, { Component, PureComponent } from 'react';
import { View } from '@tarojs/components';
import throttle from '@common/utils/thottle';
import styles from './index.module.scss';

import PropTypes from 'prop-types';
/**
 * 左滑列表项
 * @prop {object} item 列表项数据
 * @prop {number} currentId 当前滑动项id
 * @prop {string} offsetLeft 左滑距离 例如：offsetLeft={'-74px'}，左滑74像素
 * @prop {object} RenderItem 列表项渲染组件
 * @prop {function} onSliderTouch 监听滑动项触摸处理函数
 */
class SlierItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startX: 0, // x触摸起点
      startY: 0, // y触摸起点
      leftValue: 0, // 左滑距离
    }
  }

  // touchStart，更新当前触摸项，记录起点
  handleTouchStart = (e) => {
    const { item, currentId, onSliderTouch = () => { } } = this.props;
    currentId !== item.id && onSliderTouch(item.id);
    this.setState({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    });
  }

  // touchMove
  handleTouchMove = (e) => {
    const moveX = e.touches[0].clientX - this.state.startX;
    const moveY = e.touches[0].clientY - this.state.startY;
    if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > 50) {
      this.setState({
        leftValue: moveX > 0 ? 0 : this.props.offsetLeft
      });
    }
  }

  // 点击滑动项归位
  handleClickToBack = () => {
    this.state.leftValue && this.setState({ leftValue: 0 });
  }

  render() {
    const { item = [], currentId, RenderItem = null, ...other } = this.props;
    return (
      <View
        className={styles['slider-item']}
        style={{
          'transform': ` translateX(${currentId === item.id ? this.state.leftValue : 0})`
        }}
        onTouchStart={this.handleTouchStart}
        onTouchMove={throttle(this.handleTouchMove.bind(this), 30)}
        onClick={this.handleClickToBack}
      >
        {RenderItem && <RenderItem item={item} {...other} />}
      </View >
    )
  }
}

SlierItem.propTypes = {
  offsetLeft: PropTypes.string
}

SlierItem.defaultProps = {
  offsetLeft: '-74px'
}

/**
 * 左滑列表容器
 * @prop {array} list 列表数据
 */
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: 0,
    }
  }

  componentDidMount() {
    // 监听消息项之外的地方的click
    // window.addEventListener('click', this.resetSliderId)
  }

  componentWillUnmount() {
    // window.removeEventListener('click', this.resetSliderId)
  }

  // 重置滑动块id，让左滑块归位
  resetSliderId = (e) => {
    if (e.target.nodeName === 'HTML') {
      this.state.currentId && this.setState({ currentId: 0 })
    }
  }

  // 更新当前滑动项id
  updateSliderId = (id) => {
    this.setState({ currentId: id })
  }

  render() {
    const { list = [], ...other } = this.props;
    return (
      <View className={styles.slider}>
        {list.map(item => (
          <SlierItem
            key={item.id}
            item={item}
            currentId={this.state.currentId}
            onSliderTouch={this.updateSliderId}
            {...other}
          />
        ))}
      </View>
    );
  }
};

export default Index;