import React from 'react';
import styles from './index.module.scss';
import { Icon, Button } from '@discuzq/design';

/**
 * 筛选模块-选项部分
 * @prop {string} title 选项标题
 * @prop {object} optionData 选项数据
 * @prop {object} secondData 二级分类数据
 * @prop {object} firstLevelClick 一级分类点击事件
 * @prop {object} secondLevelClick 二级分类点击事件
 * @prop {number} isSecondLevelActive 二级分类选中index
 */
class Index extends React.Component{
  state = {
    classification: null,
    topicType: null,
    parameter: null,
    dataIndex: 0,
    secondData: [],
    isSecondLevelActive: 0,
  }
  firstLevelClick = (type, item, index) => {
    this.setState({
      dataIndex: index,
    })
    if (type === 1 && item.children) {
      this.setState({
        secondData: item.children,
      })
    }
    if (type === 1) {
      this.setState({
        classification: item.searchIds,
      }, () => {
        this.props.parent.filterEvents(type, this.state.classification);
      })
    }
    if (type === 2) {
      this.setState({
        topicType: item.value,
      }, () => {
        this.props.parent.filterEvents(type, this.state.topicType);
      })
    }
    if (type === 3) {
      this.setState({
        parameter: item.value,
      }, () => {
        this.props.parent.filterEvents(type, this.state.parameter);
      })
    }
  }
  secondLevelClick = (type, items, index) => {
    this.setState({
      classification: items.searchIds,
      isSecondLevelActive: index,
    }, () => {
      this.props.parent.filterEvents(type, this.state.classification);
    });
  }
  render() {
    const {type, title, optionData} = this.props;
    return (
      <div className={styles.section}>
        <div className={styles.title}>{title}</div>
        {/* 一级分类 */}
        <ul className={`${styles.itemWrap} ${styles.itemDetail}`}>
          {
            optionData.map((item, index) => {
              return <li className={ this.state.dataIndex === index ? styles.active : ''} key={index}
              onClick={() => this.firstLevelClick(type, item, index)}>{item.name}</li>
            })
          }
        </ul>
        {
          this.state.secondData.length > 0 &&
          <ul className={`${styles.itemWrap} ${styles.secondLevel}`}>
            {
              this.state.secondData.map((items, index) => {
                return <li className={this.state.isSecondLevelActive == index ? styles.active : null } key={index} onClick={() => this.secondLevelClick(type, items, index)}>{items.name}</li>
              })
            }
          </ul>
        }
      </div>
    )
  }
}
export default React.memo(Index) 