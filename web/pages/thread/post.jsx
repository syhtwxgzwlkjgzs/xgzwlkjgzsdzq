import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/thread/post/h5';
import IndexPCPage from '@layout/thread/post/pc';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithLogin from '@common/middleware/HOCWithLogin';
import * as localData from '@layout/thread/post/common';
import { Toast } from '@discuzq/design';
import { createAttachment } from '@common/server';
import { THREAD_TYPE, ATTACHMENT_TYPE, MAX_COUNT } from '@common/constants/thread-post';
import Router from '@discuzq/sdk/dist/router';
import PayBoxProvider from '@components/payBox/payBoxProvider';
import PayBox from '@components/payBox/index';
import { ORDER_TRADE_TYPE } from '@common/constants/payBoxStoreConstants';

@inject('site')
@inject('threadPost')
@inject('index')
@inject('thread')
@observer
class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emoji: {},
      // 分类选择显示状态
      categoryChooseShow: false,
      atList: [],
      topic: '',
      isVditorFocus: false,
      // 当前默认工具栏的操作 @common/constants/const defaultOperation
      currentDefaultOperation: '',
      // 当前附件工具栏的操作显示交互状态
      currentAttachOperation: false,
      // 解析完后显示商品信息
      productShow: false,
      // 语音贴上传成功的语音地址
      audioSrc: '',
      paySelectText: ['帖子付费', '附件付费'],
      curPaySelect: '',
      count: 0,
      draftShow: false,
    };
  }

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

  saveDataLocal = () => {
    const { index, threadPost } = this.props;
    localData.setThreadPostDataLocal(threadPost.postData);
    localData.setCategoryEmoji({ category: index.categoriesNoAll, emoji: threadPost.emojis });
  };

  // 从本地缓存中获取数据
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

  setCategory(categoryId) {
    const categorySelected = this.props.index.getCategorySelectById(categoryId);
    this.props.threadPost.setCategorySelected(categorySelected);
  }

  setPostData(data) {
    const { threadPost } = this.props;
    threadPost.setPostData(data);
  }

  // 处理录音完毕后的音频上传
  handleAudioUpload = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('type', ATTACHMENT_TYPE.audio);
    const res = await createAttachment(formData);
    const { code, data } = res;
    if (code === 0) {
      // 拼接不是很对，联调时和后台对一下，先本地模拟一下
      // const audioSrc = `/${data.file_path}${data.attachment}`;
      const audioSrc = window.URL.createObjectURL(blob);
      this.setState({
        audioSrc,
      });
      this.setPostData({ audio: data, audioSrc });
    }
  }

  // 表情
  handleEmojiClick = (emoji) => {
    this.setState({ emojiShow: false, emoji, currentDefaultOperation: '' });
  };

  // 分类
  handleCategoryClick = () => {
    this.setState({ categoryChooseShow: true });
  };

  // 附件相关icon
  handleAttachClick = (item) => {
    this.setState({ currentAttachOperation: item.type });
  };

  // 附件和图片上传
  handleUploadChange = (fileList, type) => {
    const { postData } = this.props.threadPost;
    const { images, files } = postData;
    const changeData = {};
    (fileList || []).map((item) => {
      let tmp = images[item.uid];
      if (type === THREAD_TYPE.file) tmp = files[item.uid];
      if (tmp) changeData[item.uid] = tmp;
      return item;
    });
    if (type === THREAD_TYPE.image) this.setPostData({ images: changeData });
    if (type === THREAD_TYPE.file) this.setPostData({ files: changeData });
  };

  // 附件和图片上传完成之后的处理
  handleUploadComplete = (ret, file, type) => {
    const { uid } = file;
    const { data } = ret;
    const { postData } = this.props.threadPost;
    const { images, files } = postData;
    if (type === THREAD_TYPE.image) images[uid] = data;
    if (type === THREAD_TYPE.file) files[uid] = data;
    this.setPostData({ images, files });
  }

  // 视频上传成功之后处理
  handleVideoUploadComplete = (ret, file) => {
    // 上传视频
    const { fileId, video } = ret;
    this.setPostData({
      video: {
        id: fileId,
        thumbUrl: video.url,
        type: file.type,
      },
    });
  }

  // 视频准备上传
  onReady = (player) => {
    const { postData } = this.props.threadPost;
    // 兼容本地视频的显示
    const opt = {
      src: postData.video.thumbUrl,
      type: postData.video.type,
    };
    player && player.src(opt);
  };

  // 编辑器
  handleVditorChange = (vditor) => {
    if (vditor) {
      const htmlString = vditor.getHTML();
      this.setPostData({ contentText: htmlString });
    }
  };

  // 关注列表
  handleAtListChange = (atList) => {
    console.log(atList);
    this.setState({ atList });
  }

  // 发布提交
  handleSubmit = async (isDraft) => {
    const { postData } = this.props.threadPost;
    if (!isDraft && !postData.contentText) {
      Toast.info({ content: '请填写您要发布的内容' });
      return;
    }
    if (!isDraft && this.state.count > MAX_COUNT) {
      Toast.info({ content: `输入的内容不能超过${MAX_COUNT}字` });
      return;
    }
    if (isDraft) this.setPostData({ draft: 1 });
    else this.setPostData({ draft: 0 });
    const { threadPost } = this.props;
    const { rewardQa, redpacket } = threadPost.postData;
    const rewardAmount = (Number(rewardQa.value) || 0);
    const redAmount = (Number(redpacket.price) || 0);
    const amount = rewardAmount + redAmount;
    const data = { amount };
    if (!isDraft && amount) {
      let type = ORDER_TRADE_TYPE.RED_PACKET;
      let title = '支付红包';
      if (redAmount) {
        data.redAmount = redAmount;
      }
      if (rewardAmount) {
        type = ORDER_TRADE_TYPE.POST_REWARD;
        title = '支付悬赏';
        data.rewardAmount = rewardAmount;
      }
      if (rewardAmount && redAmount) {
        type = ORDER_TRADE_TYPE.COMBIE_PAYMENT;
        title = '支付红包和悬赏';
      }
      PayBox.createPayBox({
        data: { ...data, title, type },
        success: async (orderInfo) => {
          const { orderSn } = orderInfo;
          this.setPostData({ orderSn });
          const { thread } = this.props;
          const threadId = this.props.router.query.id || '';
          let ret = {};
          Toast.loading({ content: isDraft ? '保存草稿中...' : '创建中...' });
          if (threadId) ret = await threadPost.updateThread(threadId);
          else ret = await threadPost.createThread();
          const { code, data, msg } = ret;
          if (code === 0) {
            thread.setThreadData(data);
            if (!isDraft) this.props.router.replace(`/thread/${data.threadId}`);
            return true;
          }
          Toast.error({ content: msg });
        }, // 支付成功回调
      });
    }

    return false;
  };

  // 保存草稿
  handleDraft = async (val) => {
    if (this.props.site.platform === 'pc') {
      this.setPostData({ draft: 1 });
      await this.submit(true);
      return;
    }
    this.setState({ draftShow: false });
    let flag = true;
    if (val === '保存草稿') {
      this.setPostData({ draft: 1 });
      flag = await this.submit(true);
    }
    if (val && flag) Router.back();
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return (
        <PayBoxProvider>
          <IndexPCPage
            setPostData={data => this.setPostData(data)}
            handleAttachClick={this.handleAttachClick}
            handleVideoUploadComplete={this.handleVideoUploadComplete}
            handleUploadChange={this.handleUploadChange}
            handleUploadComplete={this.handleUploadComplete}
            handleAudioUpload={this.handleAudioUpload}
            handleEmojiClick={this.handleEmojiClick}
            handleSetState={data => this.setState({ ...data })}
            handleSubmit={this.handleSubmit}
            saveDataLocal={this.saveDataLocal}
            handleAtListChange={this.handleAtListChange}
            handleVditorChange={this.handleVditorChange}
            {...this.state}
          />
        </PayBoxProvider>
      );
    }
    return (
      <PayBoxProvider>
        <IndexH5Page
          handleSubmit={this.handleSubmit}
        />
      </PayBoxProvider>
    );
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithLogin(PostPage));
