import React, { Component } from 'react';
import { View } from '@tarojs/components';
import Page from '@components/page';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import SliderLeft from '@components/slider-left';
import List from '@components/list';

/**
* 小程序草稿箱组件
* @prop {function} onEdit    点击草稿条栏事件
* @prop {function} dispatch 下拉刷新事件
* @prop {function} onDelete 删除事件
* @prop other List Props // List组件所有的属性
* @example 
*     <Page
      dispatch={this.fetchData}
      onEdit={item => this.handleEdit(item)}
      onDelete={item => this.handleDelete(item)}
    />
*/
// TOOD 目前页面使用的数据展示待组件编辑优化
class DraftItem extends Component { // 草稿箱渲染部分
  clickDraftTxts = (item) => { // 点击进入草稿箱
    this.props.onEdit(item);
  }
  render() {
    const { item, listlength, index } = this.props;
    return (
      <View className={styles['drafts-listbox']} >
        <View className={index === listlength - 1 ? styles['drafts-list-finally'] : styles['drafts-list']}
          onClick={this.clickDraftTxts.bind(this, item.id)} >
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
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
        { id: 4, text: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', time: '编辑于 2021-3-16' },
      ],
    }
  }

  deleteDraftTxts = (item, index) => { //删除草稿事件
    this.props.onDelete(item);
  }

  render() {
    const { index: data } = this.props;
    const { currentPage, totalPage } = data.threads || {};
    const list = (data.threads && data.threads.pageData) || [];
    return (
      <Page>
        <View className={styles['drafts-box']}>
          <List onRefresh={() => this.props.dispatch(true)} className={styles.list} noMore={currentPage >= totalPage}>
            <View className={styles['drafts-lenth']}>{this.state.list.length} 条草稿</View>
            <SliderLeft
              data={data}
              list={this.state.list}
              RenderItem={DraftItem}
              listlength={this.state.list.length}
              onBtnClick={this.deleteDraftTxts}
            />
          </List>
        </View >
      </Page>
    );
  }
}

export default Index;
