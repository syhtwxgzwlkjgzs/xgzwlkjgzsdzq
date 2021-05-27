import React from 'react';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import { noop } from '@components/thread/utils';
import { View } from '@tarojs/components';
import Router from '@discuzq/sdk/dist/router';
import { inject, observer } from 'mobx-react';


/**
 * BottomNavBar组件
 * @prop {boolean} placeholder 固定在底部时，是否在标签位置生成一个等高的占位元素
 * @prop {boolean} curr 常亮icon
 */

 @inject('index')
 @observer
 class BottomNavBar extends React.Component {

  state = {
    tabs: []
  }

  componentDidMount() {
    const { curr = 'home' } = this.props
    const tabs = [
      { icon: 'HomeOutlined', text: '首页', active: this.checkCurrActiveTab(curr, 'home'), router: '/pages/index/index' },
      { icon: 'FindOutlined', text: '发现', active: this.checkCurrActiveTab(curr, 'search'), router: '/subPages/search/index' },
      { icon: 'PlusOutlined', router: '/subPages/thread/post/index' },
      { icon: 'MailOutlined', text: '消息', active: this.checkCurrActiveTab(curr, 'message'), router: '/subPages/message/index' },
      { icon: 'ProfessionOutlined', text: '我的', active: this.checkCurrActiveTab(curr, 'my'), router: '/subPages/my/index' },
    ]

    this.setState({ tabs })
  }

  checkCurrActiveTab = (curr, target) => {
    return curr === target;
  }

  handleClick = (i, idx) => {
    const { onClick = noop } = this.props
    const { tabs } = this.state

    onClick(i, idx)
    const temp = [...tabs];
    if (i.text) {
      temp.find(i => i.active).active = false;
      temp[idx].active = true;
      this.setState({ tabs: temp })
    }
    Router.push({url: i.router});
  };


  render() {
    const { fixed = true, placeholder = false, } = this.props
    const { hiddenTabBar } = this.props.index
    const { tabs } = this.state

    return (
      <>
      <View className={styles.footer} style={{ position: fixed ? 'fixed' : '', zIndex: `${hiddenTabBar ? '-1' : '1000'}` }}>
        {tabs.map((i, idx) => (i.text ? (
            <View key={idx} className={styles.item + (i.active ? ` ${styles.active}` : '')} onClick={() => this.handleClick(i, idx)}>
              <Icon name={i.icon} size={i.icon === 'MailOutlined' ? 22 : 20} />
              <View className={styles.text}>{i.text}</View>
            </View>
        ) : (
            <View key={idx} style={{ flex: 1, textAlign: 'center' }} onClick={() => this.handleClick(i, idx)}>
              <View className={styles.addIcon}>
                <Icon name={i.icon} size={28} color="#fff" />
              </View>
            </View>
        )))}
      </View>
      {
        fixed && placeholder && (
          <View className={styles.placeholder} style={{ display: `${hiddenTabBar ? 'none' : 'block'}` }} />
        )
      }
      </>
    );
  }
};

export default BottomNavBar;
