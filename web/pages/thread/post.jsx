import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/thread/post/h5';
import IndexPCPage from '@layout/thread/post/pc';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithLogin from '@middleware/HOCWithLogin';
import * as localData from '@layout/thread/post/common';
import { Toast } from '@discuzq/design';
import { THREAD_TYPE } from '@common/constants/thread-post';
import Router from '@discuzq/sdk/dist/router';
import PayBox from '@components/payBox/index';
import { ORDER_TRADE_TYPE } from '@common/constants/payBoxStoreConstants';
import { withRouter } from 'next/router';
import { tencentVodUpload } from '@common/utils/tencent-vod';
import { plus } from '@common/utils/calculate';
import { defaultOperation } from '@common/constants/const';

@inject('site')
@inject('threadPost')
@inject('index')
@inject('thread')
@inject('user')
@observer
class PostPage extends React.Component {
  toastInstance = null;

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
      paySelectText: ['帖子付费', '附件付费'],
      curPaySelect: '',
      count: 0,
      draftShow: false,
      isTitleShow: true,
      jumpLink: '', // 退出页面时的跳转路径,默认返回上一页
    };
    this.captcha = ''; // 腾讯云验证码实例
    this.ticket = ''; // 腾讯云验证码返回票据
    this.randstr = ''; // 腾讯云验证码返回随机字符串
    this.vditor = null;
  }

  componentDidMount() {
    this.fetchPermissions();
    // 如果本地缓存有数据，这个目前主要用于定位跳出的情况
    // const postData = this.getPostDataFromLocal();
    // const { category, emoji } = localData.getCategoryEmoji() || {};
    // if (postData) {
    //   this.props.index.setCategories(category);
    //   this.props.threadPost.setEmoji(emoji);
    //   localData.removeCategoryEmoji();
    //   if (postData.categoryId) this.setCategory(postData.categoryId);
    //   this.setPostData({ ...postData, position: this.props.threadPost.postData.position });
    // } else {
    const { fetchEmoji, emojis } = this.props.threadPost;
    if (emojis.length === 0) fetchEmoji();
    this.fetchCategories();
    // }
  }

  componentWillUnmount() {
    this.captcha = '';
  }

  saveDataLocal = () => {
    const { index, threadPost } = this.props;
    // localData.setThreadPostDataLocal(threadPost.postData);
    localData.setCategoryEmoji({ category: index.categoriesNoAll, emoji: threadPost.emojis });
  };

  // 从本地缓存中获取数据
  getPostDataFromLocal() {
    const postData = localData.getThreadPostDataLocal();
    localData.removeThreadPostDataLocal();
    return postData;
  }

  fetchPermissions() {
    const { user } = this.props;
    if (!user.permissions) user.updateUserInfo();
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
    blob.name = `${new Date().getTime()}.mp3`;
    tencentVodUpload({
      file: blob,
      onUploading: () => {
        this.toastInstance = Toast.loading({
          content: '上传中...',
          duration: 0,
        });
      },
      onComplete: (res, file) => {
        this.handleVodUploadComplete(res, file, THREAD_TYPE.voice);
      },
      onError: (err) => {
        Toast.error({ content: err.message });
      },
    });
  };

  // 通过云点播上传成功之后处理：主要是针对语音和视频
  handleVodUploadComplete = async (ret, file, type) => {
    const { fileId, video } = ret;
    const params = {
      fileId,
      mediaUrl: video.url,
    };
    if (type === THREAD_TYPE.voice) params.type = 1;
    const result = await this.props.threadPost.createThreadVideoAudio(params);
    this.toastInstance?.destroy();
    const { code, data } = result;
    if (code === 0) {
      if (type === THREAD_TYPE.video) {
        this.setPostData({
          video: {
            id: data?.id,
            thumbUrl: video.url,
            type: file.type,
          },
        });
        this.scrollIntoView('#dzq-post-video');
      } else if (type === THREAD_TYPE.voice) {
        this.setPostData({
          audio: {
            id: data?.id,
            mediaUrl: video.url,
            type: file.type,
          },
          audioSrc: video.url,
        });
      }
    } else {
      Toast.error({ content: result.msg });
    }
  };

  // 表情
  handleEmojiClick = (emoji) => {
    this.setState({ emoji });
  };

  // 附件相关icon
  /**
   * 点击附件相关icon
   * @param {object} item 附件相关icon
   * @param {object} data 要设置的数据
   */
  handleAttachClick = (item, data) => {
    const { isPc } = this.props.site;
    if (!isPc && item.type === THREAD_TYPE.voice) {
      const u = navigator.userAgent.toLocaleLowerCase();

      // iphone设备降级流程
      if (u.indexOf('iphone') > -1) {
        // 判断是否在微信内
        if (u.indexOf('micromessenger') > -1) {
          Toast.info({ content: 'iOS版微信暂不支持录音功能' });
          return;
        }

        // 判断ios版本号
        const v = u.match(/cpu iphone os (.*?) like mac os/);
        if (v) {
          const version = v[1].replace(/_/g, '.').split('.')
            .splice(0, 2)
            .join('.');
          if ((Number(version) < 14.3) && !(u.indexOf('safari') > -1 && u.indexOf('chrome') < 0 && u.indexOf('qqbrowser') < 0 && u.indexOf('360') < 0)) {
            Toast.info({ content: 'iOS版本太低，请升级至iOS 14.3及以上版本或使用Safari浏览器访问' });
            return;
          }
        }
      }

      // uc浏览器降级流程
      if (u.indexOf('ucbrowser') > -1) {
        Toast.info({ content: '此浏览器暂不支持录音功能' });
        return;
      }
      // this.setState({ curPaySelect: THREAD_TYPE.voice })
    }


    // 如果是编辑操作
    const { router, threadPost } = this.props;
    const { query } = router;
    const { postData } = threadPost;
    if (query && query.id) {
      if (item.type === THREAD_TYPE.reward && postData.rewardQa.money > 0) {
        Toast.info({ content: '悬赏内容不能再次编辑' });
        return false;
      }
    }
    if (data) {
      this.setPostData(data);
      return false;
    }
    this.props.threadPost.setCurrentSelectedToolbar(item.type);
    this.setState({ currentAttachOperation: item.type }, () => {
      if (item.type === THREAD_TYPE.image) {
        this.scrollIntoView('.dzq-post-image-upload');
      }
      if (item.type === THREAD_TYPE.voice) {
        this.scrollIntoView('#dzq-post-audio-record');
      }
    });
  };

  // 滚动到可视区
  scrollIntoView = (id) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      let rect = {};
      const elem = document.querySelector(id);
      if (elem) rect = elem.getBoundingClientRect();
      const top = rect.y || 0;
      this.handleEditorBoxScroller(top);
    }, 0);
  }


  // 表情等icon
  handleDefaultIconClick = (item, child, data) => {
    const { router, threadPost } = this.props;
    const { query } = router;
    const { postData } = threadPost;
    if (query && query.id) {
      if (item.type === THREAD_TYPE.redPacket && postData.redpacket.money > 0) {
        Toast.info({ content: '红包内容不能再次编辑' });
        return false;
      }
    }
    if (data) {
      this.setPostData(data);
      return false;
    }
    if (child && child.id) {
      const content = '帖子付费和附件付费不能同时设置';
      if (postData.price && child.id === '附件付费') {
        Toast.error({ content });
        return false;
      }
      if (postData.attachmentPrice && child.id === '帖子付费') {
        Toast.error({ content });
        return false;
      }
      this.setState({ curPaySelect: child.id, emoji: {} });
    } else {
      this.setState({ currentDefaultOperation: item.id, emoji: {} }, () => {
        if (item.id === defaultOperation.attach) {
          this.scrollIntoView('.dzq-post-file-upload');
        }
      });
    }
  }

  // 附件、图片上传之前
  beforeUpload = (cloneList, showFileList, type) => {
    const { webConfig } = this.props.site;
    if (!webConfig) return false;
    // 站点支持的文件类型、文件大小
    const { supportFileExt, supportImgExt, supportMaxSize } = webConfig.setAttach;

    if (type === THREAD_TYPE.file) {
      const tempFile = cloneList[0]; // 附件上传一次只允许传一个
      // 当前选择附件的类型大小
      const fileType = tempFile.name.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
      const fileSize = tempFile.size;
      // 判断合法性
      const isLegalType = supportFileExt.toLocaleLowerCase().includes(fileType);
      const isLegalSize = fileSize > 0 && fileSize < supportMaxSize * 1024 * 1024;
      if (!isLegalType) {
        Toast.info({ content: `仅支持${supportFileExt}格式的附件` });
        return false;
      }
      if (!isLegalSize) {
        Toast.info({ content: `仅支持0 ~ ${supportMaxSize}MB的附件` });
        return false;
      }
    } else if (type === THREAD_TYPE.image) {
      // 剔除超出数量9的多余图片
      const remainLength = 9 - showFileList.length; // 剩余可传数量
      cloneList.splice(remainLength, cloneList.length - remainLength);

      let isAllLegal = true; // 状态：此次上传图片是否全部合法
      for (let i = 0; i < cloneList.length; i++) {
        const imageType = cloneList[i].name.match(/\.([^\.]+)$/)[1].toLocaleLowerCase();
        const imageSize = cloneList[i].size;
        const isLegalType = supportImgExt.toLocaleLowerCase().includes(imageType);
        const isLegalSize = imageSize > 0 && imageSize < supportMaxSize * 1024 * 1024;

        // 存在不合法图片时，从上传图片列表删除
        if (!isLegalType || !isLegalSize) {
          cloneList.splice(i, 1);
          i--;
          isAllLegal = false;
        }
      }
      !isAllLegal && Toast.info({ content: `仅支持${supportImgExt}类型的图片` });

      return true;
    }

    return true;
  }

  // 附件和图片上传
  handleUploadChange = (fileList, type) => {
    const { postData } = this.props.threadPost;
    const { images, files } = postData;
    const changeData = {};
    (fileList || []).map((item) => {
      let tmp = images[item.id] || images[item.uid];
      if (type === THREAD_TYPE.file) tmp = files[item.id] || files[item.uid];
      if (tmp) {
        if (item.id) changeData[item.id] = tmp;
        else changeData[item.uid] = tmp;
      }
      return item;
    });
    if (type === THREAD_TYPE.image) this.setPostData({ images: changeData });
    if (type === THREAD_TYPE.file) this.setPostData({ files: changeData });
  };

  // 附件和图片上传完成之后的处理
  handleUploadComplete = (ret, file, type) => {
    if (ret.code !== 0) {
      Toast.error({ content: `${ret.msg} 上传失败` });
      return false;
    }
    const { uid } = file;
    const { data } = ret;
    const { postData } = this.props.threadPost;
    const { images, files } = postData;
    if (type === THREAD_TYPE.image) images[uid] = data;
    if (type === THREAD_TYPE.file) files[uid] = data;
    this.setPostData({ images, files });
  };

  // 视频准备上传
  onVideoReady = (player) => {
    const { postData } = this.props.threadPost;
    // 兼容本地视频的显示
    const opt = {
      src: postData.video.thumbUrl,
      type: postData.video.type,
    };
    player && player.src(opt);
  };

  // 编辑器
  handleVditorChange = (vditor, event) => {
    if (vditor) {
      this.vditor = vditor;
      const htmlString = vditor.getHTML();
      this.setPostData({ contentText: htmlString });
      if (!this.props.threadPost.postData.title) {
        if (!this.state.isTitleShow || this.props.site.platform === 'pc' || !event) return;
        this.setState({ isTitleShow: false });
      }
    }
  };

  handleVditorInit = (vditor) => {
    if (vditor) this.vditor = vditor;
  }

  handleVditorFocus = () => {
    if (this.vditor) this.vditor.focus();
  }

  // 关注列表
  handleAtListChange = (atList) => {
    this.setState({ atList });
  };

  toTCaptcha = async (qcloudCaptchaAppId) => {
    // 验证码实例为空，则创建实例
    if (!this.captcha) {
      const TencentCaptcha = (await import('@common/utils/tcaptcha')).default;
      this.captcha = new TencentCaptcha(qcloudCaptchaAppId, (res) => {
        if (res.ret === 0) {
          // 验证通过后发布
          this.ticket = res.ticket;
          this.randstr = res.randstr;
          this.handleSubmit(this.props.threadPost.postData.draft);
        }
        if (res.ret === 2) {
          console.log('验证关闭');
        }
      });
    }
    // 显示验证码
    this.captcha.show();
  };

  // 发布提交
  handleSubmit = async (isDraft) => {
    const { postData, setPostData } = this.props.threadPost;
    if (!this.props.user.threadExtendPermissions.createThread) {
      Toast.info({ content: '您没有发帖权限' });
      return;
    }
    if (!isDraft && !postData.contentText) {
      Toast.info({ content: '请填写您要发布的内容' });
      return;
    }
    // if (!isDraft && this.state.count > MAX_COUNT) {
    //   Toast.info({ content: `输入的内容不能超过${MAX_COUNT}字` });
    //   return;
    // }
    if (isDraft) {
      const { contentText } = postData;
      if (contentText === '') {
        return Toast.info({ content: '内容不能为空' });
      } else {
        this.setPostData({ draft: 1 });
      }
    } else {
      this.setPostData({ draft: 0 });
    }
    const { threadPost } = this.props;

    // 2 验证码
    const { webConfig } = this.props.site;
    if (webConfig) {
      const qcloudCaptcha = webConfig?.qcloud?.qcloudCaptcha;
      const qcloudCaptchaAppId = webConfig?.qcloud?.qcloudCaptchaAppId;
      const createThreadWithCaptcha = webConfig?.other?.createThreadWithCaptcha;
      // 开启了腾讯云验证码验证时，进行验证，通过后再进行实际的发布请求
      if (qcloudCaptcha && createThreadWithCaptcha) {
        // 验证码票据，验证码字符串不全时，弹出滑块验证码
        if (!this.ticket || !this.randstr) {
          this.toTCaptcha(qcloudCaptchaAppId); // 传递appId
          return false; // 验证通过后会重新调用发布函数
        }
      }
    }

    // 将验证信息更新到发布store
    if (this.ticket && this.randstr) {
      setPostData({
        ticket: this.ticket,
        randstr: this.randstr,
      });
      this.ticket = '';
      this.randstr = '';
    }

    const threadId = this.props.router.query?.id || '';

    // 支付流程
    const { rewardQa, redpacket } = threadPost.postData;
    const { redpacketTotalAmount } = threadPost;
    // 如果是编辑的悬赏帖子，则不用再次支付
    const rewardAmount = (threadId && rewardQa.id) ? 0 : plus(rewardQa.value, 0);
    // 如果是编辑的红包帖子，则不用再次支付
    const redAmount = (threadId && redpacket.id) ? 0 : plus(redpacketTotalAmount, 0);
    const amount = plus(rewardAmount, redAmount);
    const data = { amount };
    if (!isDraft && amount > 0) {
      let type = ORDER_TRADE_TYPE.RED_PACKET;
      let title = '支付红包';
      if (redAmount > 0) {
        data.redAmount = redAmount;
      }
      if (rewardAmount > 0) {
        type = ORDER_TRADE_TYPE.POST_REWARD;
        title = '支付悬赏';
        data.rewardAmount = rewardAmount;
      }
      if (rewardAmount > 0 && redAmount > 0) {
        type = ORDER_TRADE_TYPE.COMBIE_PAYMENT;
        title = '支付红包和悬赏';
      }
      PayBox.createPayBox({
        data: { ...data, title, type },
        success: async (orderInfo) => {
          const { orderSn } = orderInfo;
          this.setPostData({ orderSn });
          this.createThread(isDraft);
        }, // 支付成功回调
      });
      return;
    }
    this.createThread(isDraft);
    return false;
  };

  async createThread(isDraft) {
    const { threadPost, thread } = this.props;
    const threadId = this.props.router.query.id || '';
    let ret = {};
    this.toastInstance = Toast.loading({ content: isDraft ? '保存草稿中...' : '创建中...' });
    if (threadId) ret = await threadPost.updateThread(threadId);
    else ret = await threadPost.createThread();
    const { code, data, msg } = ret;
    if (code === 0) {
      thread.reset();
      this.toastInstance?.destroy();
      // 防止被清除
      const _isDraft = isDraft;
      this.props.threadPost.resetPostData();

      if (!_isDraft) {
        // 更新帖子到首页列表
        if (threadId) {
          this.props.index.updateAssignThreadAllData(threadId, data);
          // 添加帖子到首页数据
        } else {
          const { categoryids = [] } = this.props.index?.filter || {}
          const { categoryId = '' } = data
          // 首页如果是全部或者是当前分类，则执行数据添加操作
          if (!categoryids.length || categoryids.indexOf(categoryId) !== -1) {
            this.props.index.addThread(data);
          }
        }
        this.props.router.replace(`/thread/${data.threadId}`);
      } else {
        const { jumpLink } = this.state;
        jumpLink ? Router.push({ url: jumpLink }) : Router.back();

      };
      return true;
    }
    Toast.error({ content: msg });
  }

  // 保存草稿
  handleDraft = (val) => {
    const { site: { isPC }, threadPost: { resetPostData } } = this.props;
    this.setState({ draftShow: false });

    if (isPC) {
      this.setPostData({ draft: 1 });
      this.handleSubmit(true);
      return;
    }

    if (val === '保存草稿') {
      this.setPostData({ draft: 1 });
      this.handleSubmit(true);
    }
    if (val === '不保存草稿') {
      resetPostData();
      const { jumpLink } = this.state;
      jumpLink ? Router.push({ url: jumpLink }) : Router.back();
    }
  }

  handleEditorBoxScroller = (top = 0) => {
    const editorbox = document.querySelector('#post-inner');
    const rect = editorbox.getBoundingClientRect();
    const gap = this.props.site?.isPc ? top - rect.top : top;
    editorbox.scrollTo({ top: gap, behavior: 'smooth' });
  };

  render() {
    const { isPC } = this.props.site;

    if (isPC) {
      return (
        <IndexPCPage
          setPostData={data => this.setPostData(data)}
          handleAttachClick={this.handleAttachClick}
          handleDefaultIconClick={this.handleDefaultIconClick}
          handleVideoUploadComplete={this.handleVodUploadComplete}
          beforeUpload={this.beforeUpload}
          handleUploadChange={this.handleUploadChange}
          handleUploadComplete={this.handleUploadComplete}
          handleAudioUpload={this.handleAudioUpload}
          handleEmojiClick={this.handleEmojiClick}
          handleSetState={data => this.setState({ ...data })}
          handleSubmit={this.handleSubmit}
          saveDataLocal={this.saveDataLocal}
          handleAtListChange={this.handleAtListChange}
          handleVditorChange={this.handleVditorChange}
          handleVditorFocus={this.handleVditorFocus}
          handleVditorInit={this.handleVditorInit}
          onVideoReady={this.onVideoReady}
          {...this.state}
        />
      );
    }
    return (
      <IndexH5Page
        setPostData={data => this.setPostData(data)}
        handleAttachClick={this.handleAttachClick}
        handleDefaultIconClick={this.handleDefaultIconClick}
        handleVideoUploadComplete={this.handleVodUploadComplete}
        beforeUpload={this.beforeUpload}
        handleUploadChange={this.handleUploadChange}
        handleUploadComplete={this.handleUploadComplete}
        handleAudioUpload={this.handleAudioUpload}
        handleEmojiClick={this.handleEmojiClick}
        handleSetState={data => this.setState({ ...data })}
        handleSubmit={this.handleSubmit}
        saveDataLocal={this.saveDataLocal}
        handleAtListChange={this.handleAtListChange}
        handleVditorChange={this.handleVditorChange}
        handleVditorFocus={this.handleVditorFocus}
        handleVditorInit={this.handleVditorInit}
        onVideoReady={this.onVideoReady}
        handleDraft={this.handleDraft}
        handleEditorBoxScroller={this.handleEditorBoxScroller}
        {...this.state}
      />
    );
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithLogin(withRouter(PostPage)));
