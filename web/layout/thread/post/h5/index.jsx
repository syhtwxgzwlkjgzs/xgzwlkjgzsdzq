/**
 * 创建帖子页面
 * TODO: 将发帖的 state 存放到 store？待定
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import DVditor from '@components/editor';
// import Upload from '@components/upload';
import { AttachmentToolbar, DefaultToolbar } from '@components/editor/toolbar';
import ToolsCategory from '@components/editor/tools/category';
import Emoji from '@components/editor/emoji';
import ImageUpload from '@components/thread-post/image-upload';
import { defaultOperation } from '@components/editor/const';
import FileUpload from '@components/thread-post/file-upload';
import { THREAD_TYPE, ATTACHMENT_TYPE } from '@common/constants/thread-post';
import { createAttachment, createThread } from '@common/server';
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
import { withRouter } from 'next/router';
import classNames from 'classnames';

@inject('threadPost')
@inject('index')
@observer
class ThreadCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiShow: false,
      emoji: {},
      imageUploadShow: false,
      imageCurrentData: {}, // 上传成功的图片
      fileCurrentData: {}, // 上传成功的附件
      videoFile: {}, // 上传功能的视频
      categoryChooseShow: false,
      categoryChoose: {
        parent: {},
        child: {},
      },
      title: '', // 标题
      categoryId: 0, // 列表
      position: {}, // 位置
      contentText: '', // 发帖内容
      contentIndexed: {}, // 插件信息
      atListShow: false,
      atList: [],
      topicShow: false,
      topic: '',
      redpacketSelectShow: false,
      redpacketSelectData: {},
      isVditorFocus: false,
      // 显示上传附件交互
      fileUploadShow: false,
      // 显示商品链接解析组件
      productSelectShow: false,
      // 解析完后显示商品信息
      productShow: false,
      // 商品信息
      productData: {},
      // 显示录音模块交互
      audioRecordShow: false,
      // 语音贴上传成功的语音地址
      audioSrc: '',
      // 显示悬赏问答属性设置页面
      rewardQaShow: false,
      // 悬赏问答页面数据
      rewardQaData: {},
    };
  }
  componentDidMount() {
    this.fetchCategories();
    const { fetchEmoji, emojis } = this.props.threadPost;
    if (emojis.length === 0) fetchEmoji();
  }

  fetchCategories() {
    const { index } = this.props;
    if (!index.categories) {
      index.fetchCategory();
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
    // TODO: 待聪华更新好之后再联调
    if (item.id === defaultOperation.redpacket) {
      this.setState({ redpacketSelectShow: true });
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
    const { code } = res;
    if (code === 0) {
      // 拼接不是很对，联调时和后台对一下，先本地模拟一下
      // const audioSrc = `/${data.file_path}${data.attachment}`;
      const audioSrc = window.URL.createObjectURL(blob);
      this.setState({
        audioSrc,
        audioRecordShow: false,
      });
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
    const { imageCurrentData, fileCurrentData } = this.state;
    const changeData = {};
    (fileList || []).map((item) => {
      let tmp = imageCurrentData[item.uid];
      if (type === THREAD_TYPE.file) tmp = fileCurrentData[item.uid];
      if (tmp) changeData[item.uid] = tmp;
      return item;
    });
    if (type === THREAD_TYPE.image) this.setState({ imageCurrentData: changeData });
    if (type === THREAD_TYPE.file) this.setState({ fileCurrentData: changeData });
  };

  handleUploadComplete = (ret, file, type) => {
    const { uid } = file;
    const { data } = ret;
    const { imageCurrentData, fileCurrentData } = this.state;
    if (type === THREAD_TYPE.image) imageCurrentData[uid] = data;
    if (type === THREAD_TYPE.file) fileCurrentData[uid] = data;
    this.setState({ imageCurrentData });
  }

  handleUploadChange = (fileList, item) => {
    console.log(fileList, item);
  }

  handleVideoUploadComplete = (ret, file, item) => {
    // 上传视频没有通
    console.log(ret, file, item);
    this.setState({ videoFile: file.originFileObj });
  }

  handleVditorChange = (vditor) => {
    if (vditor) {
      const htmlString = vditor.getHTML();
      this.setState({ contentText: htmlString });
    }
  };

  handleTitleChange = (title) => {
    this.setState({ title });
  };

  handleAtListChange = (atList) => {
    this.setState({ atList });
  }

  handleAtListCancel = () => {
    this.setState({ atListShow: false });
  }

  // 暂时在这里处理，后期如果有多个穿插的时候再做其它处理
  formatContextIndex() {
    const { imageCurrentData, videoFile, fileCurrentData, productData } = this.state;
    const imageIds = Object.values(imageCurrentData).map(item => item.id);
    const docIds = Object.values(fileCurrentData).map(item => item.id);
    const videoId = videoFile.id;
    const contentIndex = {};
    if (imageIds.length > 0) {
      contentIndex[THREAD_TYPE.image] = {
        tomId: THREAD_TYPE.image,
        body: { imageIds },
      };
    }
    if (videoId) {
      contentIndex[THREAD_TYPE.video] = {
        tomId: THREAD_TYPE.video,
        body: { videoId },
      };
    }
    if (docIds.length > 0) {
      contentIndex[THREAD_TYPE.file] = {
        tomId: THREAD_TYPE.file,
        body: { docIds },
      };
    }
    if (productData.id) {
      contentIndex[THREAD_TYPE.goods] = {
        tomId: THREAD_TYPE.goods,
        body: { ...productData },
      };
    }
    return contentIndex;
  }

  submit = async () => {
    const { title, categoryId, position, contentText } = this.state;
    if (!contentText) {
      Toast.info({ content: '请填写您要发布的内容' });
      return;
    }
    const params = {
      title,
      categoryId,
      content: {
        text: contentText,
      },
    };
    const contentIndex = this.formatContextIndex();
    if (Object.keys(contentIndex)) params.content.indexed = contentIndex;
    if (position.address) params.position = position;
    Toast.loading({ content: '创建中...' });
    const ret = await createThread(params);
    const { code, data, msg } = ret;
    if (code === 0) {
      this.props.router.replace(`/thread/${data.threadId}`);
    } else {
      Toast.error({ content: msg });
    }
  };

  onReady = (player) => {
    const { videoFile } = this.state;
    // 兼容本地视频的显示
    const opt = {
      src: videoFile.thumbUrl,
      type: videoFile.type,
    };
    player && player.src(opt);
  };

  getBottomBarStyle = () => {
    const { isVditorFocus } = this.state;
    const position = isVditorFocus ? styles['post-bottombar-absolute'] : styles['post-bottombar-fixed'];
    return classNames(styles['post-bottombar'], position);
  }

  render() {
    const { threadPost, index } = this.props;
    const {
      emojiShow,
      emoji,
      imageUploadShow,
      imageCurrentData,
      videoFile,
      categoryChooseShow,
      categoryChoose,
      atListShow,
      atList,
      topicShow,
      topic,
      redpacketSelectShow,
      fileUploadShow,
      productSelectShow,
      productShow,
      productData,
      audioRecordShow,
      audioSrc,
      rewardQaShow,
      rewardQaData,
      fileCurrentData,
    } = this.state;
    const images = Object.keys(imageCurrentData);
    const files = Object.keys(fileCurrentData);
    const category = (index.categories && index.categories.slice()) || [];
    const { value, times } = rewardQaData;

    return (
      <>
        <div className={styles.post}>
          <Title onChange={this.handleTitleChange} />
          <DVditor
            emoji={emoji}
            atList={atList}
            topic={topic}
            onChange={this.handleVditorChange}
            onFocus={() => this.setState({ isVditorFocus: true })}
            onBlur={() => this.setState({ isVditorFocus: false })}
          />

          {/* 录音组件 */}
          {(audioRecordShow) && (<AudioRecord handleAudioBlob={(blob) => {
            this.handleAudioUpload(blob);
          }} />)}

          {/* 语音组件 */}
          {(Boolean(audioSrc)) && (<Audio src={audioSrc} />)}
          {(imageUploadShow || images.length > 0) && (
            <ImageUpload
              onChange={fileList => this.handleUploadChange(fileList, THREAD_TYPE.image)}
              onComplete={(ret, file) => this.handleUploadComplete(ret, file, THREAD_TYPE.image)}
            />
          )}

          {/* 视频组件 */}
          {(videoFile && videoFile.thumbUrl) && (
            <Video className="dzq-post-video" src={videoFile.thumbUrl} onReady={this.onReady} />
          )}

          {/* 附件上传组件 */}
          {(fileUploadShow || files.length > 0) && (
            <FileUpload
              onChange={fileList => this.handleUploadChange(fileList, THREAD_TYPE.file)}
              onComplete={(ret, file) => this.handleUploadComplete(ret, file, THREAD_TYPE.file)}
            />
          )}

          {/* 商品组件 */}
          {(productShow) && (
            <Product
              good={productData}
              onDelete={() => {
                this.setState({
                  productShow: false,
                  productData: {},
                });
              }}
            />
          )}
        </div>
        <div className={this.getBottomBarStyle()}>
          <div className={styles['position-box']}>
            <Position onChange={position => this.setState({ position })} />
          </div>
          {/* 悬赏问答内容标识 */}
          {(value && times) && (
            <div className={styles['reward-qa-box']}>
              <div className={styles['reward-qa-box-content']} onClick={() => {
                this.setState({ rewardQaShow: true });
              }}>{`悬赏金额${rewardQaData.value}元\\结束时间${rewardQaData.times}`}</div>
            </div>
          )}
          {/* 调整了一下结构，因为这里的工具栏需要固定 */}
          <AttachmentToolbar
            onAttachClick={this.handleAttachClick}
            onUploadChange={this.handleUploadChange}
            onUploadComplete={this.handleVideoUploadComplete}
            category={<ToolsCategory categoryChoose={categoryChoose} onClick={this.handleCategoryClick} />}
          />
          {/* 默认的操作栏 */}
          <DefaultToolbar onClick={this.handleDefaultToolbarClick} onSubmit={this.submit}>
            {/* 表情 */}
            <Emoji show={emojiShow} emojis={threadPost.emojis} onClick={this.handleEmojiClick} />
          </DefaultToolbar>
        </div>
        <ClassifyPopup
          show={categoryChooseShow}
          category={category}
          onVisibleChange={val => this.setState({ categoryChooseShow: val })}
          onChange={(parent, child) => {
            this.setState({ categoryChoose: { parent, child }, categoryId: child.pid || parent.pid });
          }}
        />
        {atListShow && (
          <AtSelect
            visible={atListShow}
            getAtList={this.handleAtListChange}
            onCancel={this.handleAtListCancel}
          />
        )}
        {topicShow && (
          <TopicSelect
            visible={topicShow}
            cancelTopic={() => this.setState({ topicShow: false })}
            clickTopic={val => this.setState({ topic: val })}
          />
        )}
        {redpacketSelectShow && (
          <RedpacketSelect
            visible={redpacketSelectShow}
            cancel={() => this.setState({ redpacketSelectShow: false })}
            confirm={data => console.log(data)}
          />
        )}
        {/* 因为编辑器的数据暂时保存在state，跳转新路由会使数据丢失，所以先这样渲染商品选择页面，此时商品选择页面左上角的返回按钮或移动端滑动返回不可用，待优化 */}
        {productSelectShow && (
          <ProductSelect onAnalyseSuccess={
            (data) => {
              this.setState({
                productSelectShow: false,
                productShow: true,
                productData: data,
              });
            }}
          />
        )}
        {/* 悬赏问答设置页面，同上 */}
        {rewardQaShow && (
          <ForTheForm
            confirm={(data) => {
              this.setState({
                rewardQaData: data,
                rewardQaShow: false,
              });
            }}
            cancel={() => {
              this.setState({
                rewardQaShow: false,
              });
            }}
            data={rewardQaData}
          />
        )}
      </>
    );
  }
}

export default withRouter(ThreadCreate);
