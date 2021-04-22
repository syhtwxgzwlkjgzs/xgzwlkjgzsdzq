/**
 * 创建帖子页面
 * TODO: 将发帖的 state 存放到 store？待定
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

@inject('threadPost')
@inject('index')
@inject('thread')
@observer
class ThreadCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiShow: false,
      emoji: {},
      imageUploadShow: false,
      categoryChooseShow: false,
      categoryChoose: {
        parent: {},
        child: {},
      },
      atListShow: false,
      atList: [],
      topicShow: false,
      topic: '',
      redpacketSelectShow: false,
      isVditorFocus: false,
      // 显示上传附件交互
      fileUploadShow: false,
      // 显示商品链接解析组件
      productSelectShow: false,
      // 解析完后显示商品信息
      productShow: false,
      // 显示录音模块交互
      audioRecordShow: false,
      // 语音贴上传成功的语音地址
      audioSrc: '',
      // 显示悬赏问答属性设置页面
      rewardQaShow: false,
      payShow: false,
      paySelectText: ['帖子付费', '附件付费'],
      curPaySelect: '',
    };
  }
  componentDidMount() {
    this.fetchCategories();
    const { fetchEmoji, emojis } = this.props.threadPost;
    if (emojis.length === 0) fetchEmoji();
    window.addEventListener('scroll', throttle(this.handler, 50));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handler);
  }

  setPostData(data) {
    const { threadPost } = this.props;
    threadPost.setPostData(data);
  }

  fetchCategories() {
    const { index } = this.props;
    if (!index.categories || (index.categories && index.categories.length === 0)) {
      index.getReadCategories();
    }
  }

  handleDefaultToolbarClick = (item) => {
    if (item.id === defaultOperation.emoji) {
      this.setState({
        emojiShow: true,
        emoji: {},
      });
    }
    if (item.id === defaultOperation.at) {
      this.setState({ atListShow: true });
    }
    if (item.id === defaultOperation.topic) {
      this.setState({ topicShow: true });
    }
    if (item.id === defaultOperation.redpacket) {
      this.setState({ redpacketSelectShow: true });
    }
    if (item.id === defaultOperation.pay) {
      this.setState({ payShow: true });
    }
    this.setState({ emojiShow: item.id === defaultOperation.emoji });

    if (item.id === defaultOperation.attach) this.setState({ fileUploadShow: true });
    else this.setState({ fileUploadShow: false });
  };

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
        audioRecordShow: false,
      });
      this.setPostData({ audio: data, audioSrc });
    }
  }

  handleEmojiClick = (emoji) => {
    this.setState({ emojiShow: false, emoji });
  };

  handleCategoryClick = () => {
    this.setState({ categoryChooseShow: true });
  };

  handleAttachClick = (item) => {
    if (item.type === THREAD_TYPE.image) this.setState({ imageUploadShow: true });
    else this.setState({ imageUploadShow: false });

    if (item.type === THREAD_TYPE.goods) this.setState({ productSelectShow: true });
    else this.setState({ productSelectShow: false });

    if (item.type === THREAD_TYPE.voice) this.setState({ audioRecordShow: true });
    else this.setState({ audioRecordShow: false });

    if (item.type === THREAD_TYPE.reward) this.setState({ rewardQaShow: true });
    else this.setState({ rewardQaShow: false });
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
    const { fileId: id, video } = ret;
    this.setPostData({
      videoFile: {
        id,
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

  handleAtListCancel = () => {
    this.setState({ atListShow: false });
  }

  // 暂时在这里处理，后期如果有多个穿插的时候再做其它处理
  // TODO: 这个可以放到 action 里面
  formatContextIndex() {
    const { postData } = this.props.threadPost;
    const { images, video, files, product, audio, redpacket, rewardQa } = postData;
    const imageIds = Object.values(images).map(item => item.id);
    const docIds = Object.values(files).map(item => item.id);
    const contentIndex = {};
    if (imageIds.length > 0) {
      contentIndex[THREAD_TYPE.image] = {
        tomId: THREAD_TYPE.image,
        body: { imageIds },
      };
    }
    if (video.id) {
      contentIndex[THREAD_TYPE.video] = {
        tomId: THREAD_TYPE.video,
        body: { videoId: video.id },
      };
    }
    if (docIds.length > 0) {
      contentIndex[THREAD_TYPE.file] = {
        tomId: THREAD_TYPE.file,
        body: { docIds },
      };
    }
    if (product.id) {
      contentIndex[THREAD_TYPE.goods] = {
        tomId: THREAD_TYPE.goods,
        body: { ...product },
      };
    }
    if (audio.id) {
      contentIndex[THREAD_TYPE.voice] = {
        tomId: THREAD_TYPE.voice,
        body: { audioId: audio.id },
      };
    }
    // TODO:需要支付，缺少 orderId
    if (redpacket.price) {
      contentIndex[THREAD_TYPE.redPacket] = {
        tomId: THREAD_TYPE.redPacket,
        body: { ...redpacket },
      };
    }
    // TODO:需要支付，缺少 orderId
    if (rewardQa.times) {
      contentIndex[THREAD_TYPE.qa] = {
        tomId: THREAD_TYPE.qa,
        body: { expiredAt: rewardQa.times, price: rewardQa.value, type: 0 },
      };
    }
    return contentIndex;
  }

  submit = async () => {
    const { postData } = this.props.threadPost;
    if (!postData.contentText) {
      Toast.info({ content: '请填写您要发布的内容' });
      return;
    }
    const params = {
      title: postData.title,
      categoryId: postData.categoryId,
      content: {
        text: postData.contentText,
      },
    };
    const contentIndex = this.formatContextIndex();
    if (Object.keys(contentIndex)) params.content.indexes = contentIndex;
    if (postData.position.address) params.position = postData.position;
    Toast.loading({ content: '创建中...' });
    const { threadPost, thread } = this.props;
    const ret = await threadPost.createThread(params);
    const { code, data, msg } = ret;
    if (code === 0) {
      thread.setThreadData(data);
      this.props.router.replace(`/thread/${data.threadId}`);
    } else {
      Toast.error({ content: msg });
    }
  };

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
    this.setBottomBarStyle(window.scrollY);
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
      document.body.style.height = '100%';
    }, 100);
  }

  render() {
    const { threadPost, index } = this.props;
    const { postData } = threadPost;
    const {
      categoryChooseShow,
      emojiShow,
      atListShow,
      topicShow,
      rewardQaShow,
      productSelectShow,
      redpacketSelectShow,
      emoji,
      topic,
      atList,
    } = this.state;
    const category = (index.categories && index.categories.slice()) || [];
    // 悬赏问答
    if (rewardQaShow) return (
      <ForTheForm
        confirm={(data) => {
          this.setPostData({ rewardQa: data });
          this.setState({ rewardQaShow: false });
        }}
        cancel={() => {
          this.setState({
            rewardQaShow: false,
          });
        }}
        data={postData.rewardQa}
      />
    );
    // 插入商品
    if (productSelectShow) return (
      <ProductSelect onAnalyseSuccess={
        (data) => {
          this.setState({ productSelectShow: false });
          this.setPostData({ product: data });
        }}
        cancel={() => this.setState({ productSelectShow: false })}
      />
    );
    // 插入红包
    if (redpacketSelectShow) return (
      <RedpacketSelect
        data={postData.redpacket}
        cancel={() => this.setState({ redpacketSelectShow: false })}
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
        <Header />
        <div className={styles['post-inner']}>
          <Title
            title={postData.title}
            onChange={title => this.setPostData({ title })}
            onFocus={this.setBottomFixed}
            onBlur={this.clearBottomFixed}
          />
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
          />

          {/* 录音组件 */}
          {(this.state.audioRecordShow) && (<AudioRecord handleAudioBlob={(blob) => {
            this.handleAudioUpload(blob);
          }} />)}

          {/* 语音组件 */}
          {(Boolean(postData.audioSrc)) && (<Audio src={postData.audioSrc} />)}
          {(this.state.imageUploadShow || Object.keys(postData.images).length > 0) && (
            <ImageUpload
              onChange={fileList => this.handleUploadChange(fileList, THREAD_TYPE.image)}
              onComplete={(ret, file) => this.handleUploadComplete(ret, file, THREAD_TYPE.image)}
            />
          )}

          {/* 视频组件 */}
          {(postData.video && postData.video.thumbUrl) && (
            <Video className="dzq-post-video" src={postData.video.thumbUrl} onReady={this.onReady} />
          )}
          {/* 附件上传组件 */}
          {(this.state.fileUploadShow || Object.keys(postData.files).length > 0) && (
            <FileUpload
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
          <div id="post-position" className={styles['position-box']}>
            <Position onChange={position => this.setPostData({ position })} />
          </div>
          {/* 调整了一下结构，因为这里的工具栏需要固定 */}
          <AttachmentToolbar
            onAttachClick={this.handleAttachClick}
            // onUploadChange={this.handleUploadChange}
            onUploadComplete={this.handleVideoUploadComplete}
            category={<ToolsCategory categoryChoose={threadPost.categorySeleted} onClick={this.handleCategoryClick} />}
          />
          {/* 默认的操作栏 */}
          <DefaultToolbar onClick={this.handleDefaultToolbarClick} onSubmit={this.submit}>
            {/* 表情 */}
            <Emoji show={emojiShow} emojis={threadPost.emojis} onClick={this.handleEmojiClick} />
          </DefaultToolbar>
        </div>
        {/* 选择帖子类别 */}
        <ClassifyPopup
          show={categoryChooseShow}
          category={category}
          onVisibleChange={val => this.setState({ categoryChooseShow: val })}
          onChange={(parent, child) => {
            this.setPostData({ categoryId: child.pid || parent.pid });
            threadPost.setCategorySeleted({ parent, child });
          }}
        />
        {/* 插入 at 关注的人 */}
        {atListShow && (
          <AtSelect
            visible={atListShow}
            getAtList={this.handleAtListChange}
            onCancel={this.handleAtListCancel}
          />
        )}
        {/* 插入选中的话题 */}
        {topicShow && (
          <TopicSelect
            visible={topicShow}
            cancelTopic={() => this.setState({ topicShow: false })}
            clickTopic={val => this.setState({ topic: val })}
          />
        )}
        {/* 付费选择 */}
        {this.state.payShow && (
          <PostPopup
            visible={this.state.payShow}
            list={this.state.paySelectText}
            onClick={val => this.setState({ curPaySelect: val })}
            cancel={() => this.setState({ payShow: false })}
          />
        )}
      </>
    );
  }
}

export default withRouter(ThreadCreate);
