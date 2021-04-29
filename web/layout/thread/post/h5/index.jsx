/**
 * 创建帖子页面
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import DVditor from '@components/editor';
import { AttachmentToolbar, DefaultToolbar } from '@components/editor/toolbar';
import ToolsCategory from '@components/editor/tools/category';
import Emoji from '@components/editor/emoji';
import ImageUpload from '@components/thread-post/image-upload';
import { defaultOperation } from '@common/constants/const';
import FileUpload from '@components/thread-post/file-upload';
import { THREAD_TYPE, ATTACHMENT_TYPE } from '@common/constants/thread-post';
import { createAttachment } from '@common/server';
import { Video, Audio, AudioRecord, Toast } from '@discuzq/design';
import ClassifyPopup from '@components/thread-post/classify-popup';
import ProductSelect from '@components/thread-post/product-select';
import Product from '@components/thread-post/product';
import ForTheForm from '@components/thread/for-the-form';
import styles from './index.module.scss';
import Title from '@components/thread-post/title';
import Position from '@components/thread-post/position';
import AtSelect from '@components/thread-post/at-select';
import TopicSelect from '@components/thread-post/topic-select';
import RedpacketSelect from '@components/thread-post/redpacket-select';
import PostPopup from '@components/thread-post/post-popup';
import AllPostPaid from '@components/thread/all-post-paid';
import { withRouter } from 'next/router';
import { getVisualViewpost } from '@common/utils/get-client-height';
import throttle from '@common/utils/thottle';
import Header from '@components/header';
import Router from '@discuzq/sdk/dist/router';
import * as localData from '../common';

const maxCount = 5000;

@inject('threadPost')
@inject('index')
@inject('thread')
@observer
class ThreadCreate extends React.Component {
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
    window.addEventListener('scroll', this.handler);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handler);
  }

  getPostDataFromLocal() {
    const postData = localData.getThreadPostDataLocal();
    localData.removeThreadPostDataLocal();
    return postData;
  }

  setPostData(data) {
    const { threadPost } = this.props;
    threadPost.setPostData(data);
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

  // 处理录音完毕后的音频上传
  handleAudioUpload = async (blob) => {
    Toast.loading({ content: '上传中' });
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

  handleEmojiClick = (emoji) => {
    this.setState({ emojiShow: false, emoji, currentDefaultOperation: '' });
  };

  handleCategoryClick = () => {
    this.setState({ categoryChooseShow: true });
  };

  handleAttachClick = (item) => {
    this.setState({ currentAttachOperation: item.type });
  };

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

  handleUploadComplete = (ret, file, type) => {
    const { uid } = file;
    const { data } = ret;
    const { postData } = this.props.threadPost;
    const { images, files } = postData;
    if (type === THREAD_TYPE.image) images[uid] = data;
    if (type === THREAD_TYPE.file) files[uid] = data;
    this.setPostData({ images, files });
  }

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

  handleVditorChange = (vditor) => {
    if (vditor) {
      const htmlString = vditor.getHTML();
      this.setPostData({ contentText: htmlString });
    }
  };

  handleAtListChange = (atList) => {
    this.setState({ atList });
  }

  submit = async (isDraft) => {
    const { postData } = this.props.threadPost;
    if (!isDraft && !postData.contentText) {
      Toast.info({ content: '请填写您要发布的内容' });
      return;
    }
    if (!isDraft && this.state.count > maxCount) {
      Toast.info({ content: `输入的内容不能超过${maxCount}字` });
      return;
    }
    Toast.loading({ content: isDraft ? '保存草稿中...' : '创建中...' });
    const { threadPost, thread } = this.props;
    const threadId = this.props.router.query.id || '';
    let ret = {};
    if (threadId) ret = await threadPost.updateThread(threadId);
    else ret = await threadPost.createThread();
    const { code, data, msg } = ret;
    if (code === 0) {
      thread.setThreadData(data);
      if (!isDraft) this.props.router.replace(`/thread/${data.threadId}`);
      return true;
    }
    Toast.error({ content: msg });

    return false;
  };

  handleDraft = async (val) => {
    this.setState({ draftShow: false });
    let flag = true;
    if (val === '保存草稿') {
      this.setPostData({ draft: 1 });
      flag = await this.submit(true);
    }
    if (val && flag) Router.back();
  }

  onReady = (player) => {
    const { postData } = this.props.threadPost;
    // 兼容本地视频的显示
    const opt = {
      src: postData.video.thumbUrl,
      type: postData.video.type,
    };
    player && player.src(opt);
  };

  handler = () => {
    throttle(this.setBottomBarStyle(window.scrollY), 50);
  }

  // 设置底部bar的样式
  setBottomBarStyle = (y = 0) => {
    const height = getVisualViewpost();
    const vditorToolbar = document.querySelector('#dzq-vditor .vditor-toolbar');
    const postBottombar = document.querySelector('#post-bottombar');
    const position = document.querySelector('#post-position');
    if (!position) return;
    position.style.display = 'none';
    postBottombar.style.top = `${height - 90 + y}px`;
    vditorToolbar.style.position = 'fixed';
    vditorToolbar.style.top = `${height - 130 + y}px`;
  }
  setBottomFixed = () => {
    const timer = setTimeout(() => {
      if (timer) clearTimeout(timer);
      this.setBottomBarStyle(0);
    }, 150);
  }
  clearBottomFixed = () => {
    const timer = setTimeout(() => {
      if (timer) clearTimeout(timer);
      const height = getVisualViewpost();
      const postBottombar = document.querySelector('#post-bottombar');
      const position = document.querySelector('#post-position');
      if (!position) return;
      position.style.display = 'flex';
      postBottombar.style.top = `${height - 134}px`;
    }, 100);
  }

  render() {
    const { threadPost, index } = this.props;
    const { postData } = threadPost;
    const { emoji, topic, atList, currentDefaultOperation, currentAttachOperation, categoryChooseShow } = this.state;
    const category = ((index.categories && index.categories.slice()) || []).filter(item => item.name !== '全部');
    // 悬赏问答
    if (currentAttachOperation === THREAD_TYPE.reward) return (
      <ForTheForm
        confirm={(data) => {
          this.setPostData({ rewardQa: data });
          this.setState({ currentAttachOperation: false });
        }}
        cancel={() => {
          this.setState({
            currentAttachOperation: false,
          });
        }}
        data={postData.rewardQa}
      />
    );
    // 插入商品
    if (currentAttachOperation === THREAD_TYPE.goods) return (
      <ProductSelect onAnalyseSuccess={
        (data) => {
          this.setState({ currentAttachOperation: false });
          this.setPostData({ product: data });
        }}
        cancel={() => this.setState({ currentAttachOperation: false })}
      />
    );
    // 插入红包
    if (currentDefaultOperation === defaultOperation.redpacket) return (
      <RedpacketSelect
        data={postData.redpacket}
        cancel={() => this.setState({ currentDefaultOperation: '' })}
        confirm={data => this.setPostData({ redpacket: data })}
      />
    );
    // 付费设置
    const { freeWords, price, attachmentPrice } = threadPost.postData;
    if (this.state.curPaySelect) return (
      <AllPostPaid
        exhibition={this.state.curPaySelect}
        cancle={() => {
          this.setState({ curPaySelect: '' });
        }}
        data={{ freeWords, price, attachmentPrice }}
        confirm={(data) => {
          const { freeWords, price, attachmentPrice } = data;
          this.setPostData({ freeWords: freeWords / 100,  price, attachmentPrice });
        }}
      />
    );

    return (
      <>
        <Header
          isBackCustom={() => {
            this.setState({ draftShow: true });
            return false;
          }}
        />
        <div className={styles['post-inner']}>
          {/* 标题 */}
          <Title
            isDisplay={true}
            title={postData.title}
            onChange={title => this.setPostData({ title })}
            onFocus={this.setBottomFixed}
            onBlur={this.clearBottomFixed}
            autofocus
          />
          {/* 编辑器 */}
          <DVditor
            value={postData.contentText}
            emoji={emoji}
            atList={atList}
            topic={topic}
            onChange={this.handleVditorChange}
            onFocus={() => {
              this.setBottomFixed();
              this.setState({ isVditorFocus: true });
            }}
            onBlur={() => {
              this.setState({ isVditorFocus: false });
              this.clearBottomFixed();
            }}
            onCountChange={count => this.setState({ count })}
          />

          {/* 录音组件 */}
          {(currentAttachOperation === THREAD_TYPE.voice) && (
            <div className={styles['audio-record']}>
              <AudioRecord onUpload={(blob) => {
                this.handleAudioUpload(blob);
              }} />
            </div>
          )}

          {/* 语音组件 */}
          {(Boolean(postData.audio.mediaUrl)) && (<Audio src={postData.audio.mediaUrl} />)}
          {(currentAttachOperation === THREAD_TYPE.image || Object.keys(postData.images).length > 0) && (
            <ImageUpload
              fileList={Object.values(postData.images)}
              onChange={fileList => this.handleUploadChange(fileList, THREAD_TYPE.image)}
              onComplete={(ret, file) => this.handleUploadComplete(ret, file, THREAD_TYPE.image)}
            />
          )}

          {/* 视频组件 */}
          {(postData.video && postData.video.thumbUrl) && (
            <Video className="dzq-post-video" src={postData.video.thumbUrl} onReady={this.onReady} />
          )}
          {/* 附件上传组件 */}
          {(currentDefaultOperation === defaultOperation.attach || Object.keys(postData.files).length > 0) && (
            <FileUpload
              fileList={Object.values(postData.files)}
              onChange={fileList => this.handleUploadChange(fileList, THREAD_TYPE.file)}
              onComplete={(ret, file) => this.handleUploadComplete(ret, file, THREAD_TYPE.file)}
            />
          )}

          {/* 商品组件 */}
          {postData.product && postData.product.readyContent && (
            <Product
              good={postData.product}
              onDelete={() => this.setPostData({ product: {} })}
            />
          )}
          {/* 悬赏问答内容标识 */}
          {(postData.rewardQa.value && postData.rewardQa.times) && (
            <div className={styles['reward-qa-box']}>
              <div className={styles['reward-qa-box-content']} onClick={() => {
                this.setState({ rewardQaShow: true });
              }}>{`悬赏金额${postData.rewardQa.value}元\\结束时间${postData.rewardQa.times}`}</div>
            </div>
          )}
          {/* 红包信息 */}
          {postData.redpacket.price && (
            <div className={styles['reward-qa-box']}>
              <div className={styles['reward-qa-box-content']} onClick={() => this.setState({ redpacketSelectShow: true })}>
                {postData.redpacket.rule === 1 ? '随机红包' : '定额红包'}\
                总金额{postData.redpacket.price}元\{postData.redpacket.number}个
                {postData.redpacket.condition === 1 && `\\集赞个数${postData.redpacket.likenum}`}
              </div>
            </div>
          )}
        </div>
        <div id="post-bottombar" className={styles['post-bottombar']}>
          {/* 插入位置 */}
          <div id="post-position" className={styles['position-box']}>
            <Position
              position={postData.position}
              onClick={() => {
                localData.setThreadPostDataLocal(postData);
                localData.setCategoryEmoji({ category, emoji: threadPost.emojis });
              }}
              onChange={position => this.setPostData({ position })} />
            <div className={styles['post-counter']}>还能输入{maxCount - this.state.count}个字</div>
          </div>
          {/* 调整了一下结构，因为这里的工具栏需要固定 */}
          <AttachmentToolbar
            onAttachClick={this.handleAttachClick}
            // onUploadChange={this.handleUploadChange}
            onUploadComplete={this.handleVideoUploadComplete}
            category={<ToolsCategory categoryChoose={threadPost.categorySelected} onClick={this.handleCategoryClick} />}
          />
          {/* 默认的操作栏 */}
          <DefaultToolbar
            value={currentDefaultOperation}
            onClick={item => this.setState({ currentDefaultOperation: item.id, emoji: {} })}
            onSubmit={this.props.handleSubmit}>
            {/* 表情 */}
            <Emoji
              show={currentDefaultOperation === defaultOperation.emoji}
              emojis={threadPost.emojis}
              onClick={this.handleEmojiClick} />
          </DefaultToolbar>
        </div>
        {/* 选择帖子类别 */}
        <ClassifyPopup
          show={categoryChooseShow}
          category={category}
          categorySelected={threadPost.categorySelected}
          onVisibleChange={val => this.setState({ categoryChooseShow: val })}
          onChange={(parent, child) => {
            this.setPostData({ categoryId: child.pid || parent.pid });
            threadPost.setCategorySelected({ parent, child });
          }}
        />
        {/* 插入 at 关注的人 */}
        {currentDefaultOperation === defaultOperation.at && (
          <AtSelect
            visible={currentDefaultOperation === defaultOperation.at}
            getAtList={this.handleAtListChange}
            onCancel={() => this.setState({ currentDefaultOperation: '' })}
          />
        )}
        {/* 插入选中的话题 */}
        {currentDefaultOperation === defaultOperation.topic && (
          <TopicSelect
            visible={currentDefaultOperation === defaultOperation.topic}
            cancelTopic={() => this.setState({ currentDefaultOperation: '' })}
            clickTopic={val => this.setState({ topic: val })}
          />
        )}
        {/* 付费选择 */}
        {currentDefaultOperation === defaultOperation.pay && (
          <PostPopup
            list={this.state.paySelectText}
            onClick={val => this.setState({ curPaySelect: val })}
            cancel={() => this.setState({ currentDefaultOperation: '' })}
            visible={currentDefaultOperation === defaultOperation.pay}
          />
        )}
        {/* 是否保存草稿 */}
        {this.state.draftShow && (
          <PostPopup
            list={['保存草稿', '不保存草稿']}
            onClick={val => this.handleDraft(val)}
            cancel={() => this.handleDraft()}
            visible={this.state.draftShow}
          />
        )}
      </>
    );
  }
}

export default withRouter(ThreadCreate);
