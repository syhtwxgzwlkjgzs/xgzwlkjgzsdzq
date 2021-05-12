import React, { Component } from 'react';
import { View } from '@tarojs/components';
import Page from '@components/page';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import SliderLeft from '@components/slider-left';

class DraftItem extends Component { // 草稿箱渲染部分
  clickDraftTxts = (item) => { // 点击进入草稿箱
    console.log(item); //接上接口就改为跳转路由
  }
  render() {
    const { item, listlength, index, ...props } = this.props;
    return (
      <View className={styles['drafts-listbox']} >
        <View className={index === listlength - 1 ? styles['drafts-list-finally'] : styles['drafts-list']} onClick={this.clickDraftTxts.bind(this, item.id)} >
          <View>{item.text}</View>
          <View className={styles['drafts-time']}>{item.time}</View>
        </View>
      </View>
    )
  }
}

@inject('index')
@observer
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        { id: 1, text: '运行dzq只适合带宽按量付的云服务器', time: '编辑于 2分钟前' },
        { id: 2, text: 'Users你好，你的注册申请已审核通过。', time: '编辑于 2021-3-19' },
        { id: 3, text: '心有猛虎，细嗅蔷薇', time: '编辑于 1分钟前' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
      ],
    }
  }

  async componentDidMount() {
    // const arr = await this.props.index.getReadCategories(); // 主页数据
  }
  deleteDraftTxts = (item, index) => { //删除草稿事件
    setTimeout(() => { // 先写删除数组里面的值，接上接口时应该发个删除的请求，然后更新列表
      this.setState = {
        list: this.state.list.splice(index, 1)
      }
    }, 0)
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <Page>
        <View className={styles['drafts-box']}>
          {/* 草稿箱列表部分 */}
          {/* <BaseLayout className={styles.list} onRefresh={() => { onRefreshs() }} onPullDown={() => { console.log('下拉了') }} showPullDown={true}> */}
          {/* 显示草稿条数 */}
          <View className={styles['drafts-lenth']}>{this.state.list.length} 条草稿</View>
          {/* 显示草稿条数结束 */}
          <SliderLeft list={this.state.list} RenderItem={DraftItem} listlength={this.state.list.length} onBtnClick={this.deleteDraftTxts} />
          {/* 草稿箱列表部分结束 */}
          {/* </BaseLayout> */}
        </View >
      </Page>
    );
  }
}

export default Index;
