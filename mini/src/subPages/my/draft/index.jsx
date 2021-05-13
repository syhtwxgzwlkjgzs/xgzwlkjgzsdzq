import React, { Component } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Page from '@components/page';
import { Toast } from '@discuzq/design';
import List from '@components/list';
import { inject, observer } from 'mobx-react';
import SliderLeft from '@components/slider-left';
import { THREAD_LIST_FILTER_COMPLEX } from '@common/constants/index';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';
// TOOD 目前页面使用的数据展示待组件编辑优化
class DraftItem extends React.Component { // 草稿箱渲染部分

  handleEdit = (item) => {
    Taro.navigateTo({ url: `/subPages/thread/post/index?id=${item.threadId}` })
  } // 点击进入草稿箱

  render() {
    const { item, listlength, index } = this.props;
    return (
      <View className={styles['drafts-listbox']} >
        <View
          className={index === listlength - 1 ? styles['drafts-list-finally'] : styles['drafts-list']}
          onClick={this.handleEdit}
        >
          <View dangerouslySetInnerHTML={{ __html: item.content.text }} />
          <View className={styles['drafts-time']}>{diffDate(item.createdAt)}</View>
        </View>
      </View>
    )
  }
}

@inject('index')
@inject('thread')
@observer
class Index extends Component {
  page = 1;
  perPage = 10;
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async (isMore) => {
    const { index } = this.props;
    if (isMore) this.page += 1;
    else this.page = 1;
    await index.getReadThreadList({
      page: this.page,
      perPage: this.perPage,
      filter: { complex: THREAD_LIST_FILTER_COMPLEX.draft },
    });
    return;
  }

  handleDelete = async (item) => { // 删除草稿事件
    const { thread, index } = this.props;
    // this.toastInstance = Toast.loading({
    //   content: '删除中...',
    //   duration: 0,
    // });
    let time = 0;
    Toast.loading({
      content: '删除中...',
      duration: time,
    });
    const res = await thread.delete(item.threadId);
    // this.toastInstance?.destroy();
    time = 1
    if (res.code === 0) {
      const data = (index.threads?.postData || []).filter(elem => elem.threadId !== item.threadId);
      index.setThreads(data);
    } else {
      Toast.error({ content: res.msg });
    }
  }

  render() {
    const { index: data } = this.props;
    const { currentPage, totalPage } = data.threads || {};
    const list = (data.threads && data.threads.pageData) || [];
    return (
      <Page>
        <View className={styles['drafts-box']}>
          <List onRefresh={() => this.fetchData(true)} className={styles.list} noMore={currentPage >= totalPage}>
            <View className={styles['drafts-lenth']}>{list.length} 条草稿</View>
            <SliderLeft
              data={data}
              list={list}
              RenderItem={DraftItem}
              listlength={list.length}
              onBtnClick={item => this.handleDelete(item)}
            />
          </List>
        </View >
      </Page>
    );
  }
}

export default Index;
