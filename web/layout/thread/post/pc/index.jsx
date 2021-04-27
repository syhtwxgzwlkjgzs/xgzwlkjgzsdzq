import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Header from '@components/header';
import DVditor from '@components/editor';
import Title from '@components/thread-post-pc/title';
import { AttachmentToolbar, DefaultToolbar } from '@components/editor/toolbar';
import Position from '@components/thread-post/position';
import { Toast, Button } from '@discuzq/design';
import ClassifyPopup from '@components/thread-post/classify-popup';
import { withRouter } from 'next/router';
import * as localData from '../common';

@inject('threadPost')
@inject('index')
@inject('thread')
@observer
class ThreadPCPage extends React.Component {
  componentDidMount() {
    // 如果本地缓存有数据，这个目前主要用于定位跳出的情况
    const postData = this.getPostDataFromLocal();
    const { category, emoji } = localData.getCategoryEmoji() || {};
    if (postData) {
      this.props.index.setCategories(category);
      this.props.threadPost.setEmoji(emoji);
      localData.removeCategoryEmoji();
      if (postData.categoryId) this.setCategory(postData.categoryId);
      this.setPostData({ ...postData, position: this.props.threadPost.postData.position });
    } else {
      const { fetchEmoji, emojis } = this.props.threadPost;
      if (emojis.length === 0) fetchEmoji();
      this.fetchCategories();
    }
  }

  getPostDataFromLocal() {
    const postData = localData.getThreadPostDataLocal();
    localData.removeThreadPostDataLocal();
    return postData;
  }

  async fetchCategories() {
    const { index, thread, threadPost } = this.props;
    let { categories } = index;
    if (!categories || (categories && categories.length === 0)) {
      categories = await index.getReadCategories();
    }
    // 如果是编辑操作，需要获取链接中的帖子id，通过帖子id获取帖子详情信息
    const { query } = this.props.router;
    if (query && query.id) {
      const id = Number(query.id);
      let ret = {};
      if (id === (thread.threadData && thread.threadData.id) && thread.threadData) {
        ret.data = thread.threadData;
        ret.code = 0;
      } else ret = await thread.fetchThreadDetail(id);
      if (ret.code === 0) {
        const { categoryId } = ret.data;
        this.setCategory(categoryId);
        threadPost.formatThreadDetailToPostData(ret.data);
      } else {
        Toast.error({ content: ret.msg });
      }
    }
  }

  setPostData(data) {
    const { threadPost } = this.props;
    threadPost.setPostData(data);
  }

  render() {
    const { threadPost, index } = this.props;
    // const category = index.categoriesNoAll;

    return (
      <>
        <Header />
        <div className={styles.wrapper}>
          <div className={styles['wrapper-inner']}>
            <Title pc isDisplay={true} />
            <div className={styles.editor}>
              <DVditor
                pc
                onChange={() => { }}
                onCountChange={() => { }}
                onFocus={() => { }}
                onBlur={() => {}}
              />
            </div>
            <div className={styles.toolbar}>
              <div className={styles['toolbar-left']}>
                <DefaultToolbar pc />
                <div className={styles.divider}></div>
                <AttachmentToolbar pc />
              </div>
              <div className={styles['toolbar-right']}>
                <Position />
              </div>
            </div>
            <ClassifyPopup
              pc
              category={index.categoriesNoAll}
              categorySelected={threadPost.categorySelected}
              onChange={(parent, child) => {
                this.setPostData({ categoryId: child.pid || parent.pid });
                threadPost.setCategorySelected({ parent, child });
              }}
            />
            <div className={styles.footer}>
              <Button type="info">保存至草稿箱</Button>
              <Button type="primary">发布</Button>
            </div>
          </div>
          <div className={styles.copyright}>
            Powered By Discuz! Q © 2021   粤ICP备20008502号-1
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ThreadPCPage);
