/**
 * 创建帖子页面
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import DVditor from '@components/editor';
// import Upload from '@components/upload';
import { AttachmentToolbar, DefaultToolbar } from '@components/editor/toolbar';
import Emoji from '@components/editor/emoji';
import ImageUpload from '@components/thread-post/image-upload';
import { THREAD_TYPE } from '@common/constants/thread-post';
import { Video } from '@discuzq/design';

@inject('threadPost')
@observer
class ThreadCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiShow: false,
      emoji: {},
      imageUploadShow: false,
      imageCurrentData: {},
      videoFile: {},
    };
  }
  componentDidMount() {
    const { fetchEmoji } = this.props.threadPost;
    fetchEmoji();
  }

  handleDefaultToolbarClick = (item) => {
    this.setState({
      emojiShow: item.id === 'emoji',
      emoji: {},
    });
  };

  handleEmojiClick = (emoji) => {
    this.setState({ emojiShow: false, emoji });
  };

  handleCategoryClick = () => {
    console.log('category click');
  };

  handleAttachClick = (item) => {
    if (item.type === THREAD_TYPE.image) this.setState({ imageUploadShow: true });
    else this.setState({ imageUploadShow: false });
  };

  handleImageUploadChange = (fileList) => {
    const { imageCurrentData } = this.state;
    const changeData = {};
    (fileList || []).map((item) => {
      if (imageCurrentData[item.uid]) changeData[item.uid] = imageCurrentData[item.uid];
      return item;
    });
    this.setState({ imageCurrentData: changeData });
  };

  handleImageUploadComplete = (ret, file) => {
    const { uid } = file;
    const { data } = ret;
    const { imageCurrentData } = this.state;
    imageCurrentData[uid] = data;
    this.setState({ imageCurrentData });
  }

  handleUploadChange = (fileList, item) => {
    console.log(fileList, item);
  }

  handleUploadComplete = (ret, file, item) => {
    // 上传视频没有通
    console.log(ret, file, item);
    this.setState({ videoFile: file.originFileObj });
  }

  onReady = (player) => {
    const { videoFile } = this.state;
    // 兼容本地视频的显示
    const opt = {
      src: videoFile.thumbUrl,
      type: videoFile.type,
    };
    player && player.src(opt);
  };

  render() {
    const { threadPost } = this.props;
    const { emojiShow, emoji, imageUploadShow, imageCurrentData, videoFile } = this.state;
    const images = Object.keys(imageCurrentData);

    return (
      <>
        <DVditor emoji={emoji} />
        {(imageUploadShow || images.length > 0) && (
          <ImageUpload
            onChange={this.handleImageUploadChange}
            onComplete={this.handleImageUploadComplete}
          />
        )}
        {(videoFile && videoFile.thumbUrl) && (
          <Video className="dzq-post-video" src={videoFile.thumbUrl} onReady={this.onReady} />
        )}
        {/* 调整了一下结构，因为这里的工具栏需要固定 */}
        <AttachmentToolbar
          onCategoryClick={this.handleCategoryClick}
          onAttachClick={this.handleAttachClick}
          onUploadChange={this.handleUploadChange}
          onUploadComplete={this.handleUploadComplete}
        />
        {/* 默认的操作栏 */}
        <DefaultToolbar onClick={this.handleDefaultToolbarClick}>
          {/* 表情 */}
          <Emoji show={emojiShow} emojis={threadPost.emojis} onClick={this.handleEmojiClick} />
        </DefaultToolbar>
      </>
    );
  }
}

export default ThreadCreate;
