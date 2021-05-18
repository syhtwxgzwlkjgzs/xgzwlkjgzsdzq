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
import { THREAD_TYPE } from '@common/constants/thread-post';
import { Audio, AudioRecord, Icon } from '@discuzq/design';
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
import VideoDisplay from '@components/thread-post/video-display';
import MoneyDisplay from '@components/thread-post/money-display';

function isIOS() {
  return /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i.test(window.navigator.userAgent.toLowerCase());
}

@inject('threadPost')
@inject('site')
@inject('index')
@inject('thread')
@inject('user')
@observer
class ThreadCreate extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handler);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handler);
  }

  handleDraft = async (val) => {
    this.props.handleSetState({ draftShow: false });
    let flag = true;
    if (val === '保存草稿') {
      this.props.setPostData({ draft: 1 });
      flag = await this.props.handleSubmit(true);
    }
    if (val && flag) Router.back();
  }

  handler = () => {
    if (!isIOS()) return;
    throttle(this.setBottomBarStyle(window.scrollY), 50);
  }

  // 设置底部bar的样式
  setBottomBarStyle = (y = 0, action) => {
    const height = getVisualViewpost();
    const vditorToolbar = document.querySelector('#dzq-vditor .vditor-bubble-toolbar');
    const postBottombar = document.querySelector('#post-bottombar');
    const position = document.querySelector('#post-position');
    const gap = position.clientHeight - vditorToolbar.clientHeight;
    const bottombarHeight = postBottombar.clientHeight;
    const toolbarTop = height - bottombarHeight + gap;
    if (!isIOS()) {
      if (vditorToolbar) {
        vditorToolbar.style.display = 'flex';
        vditorToolbar.style.position = 'fixed';
        vditorToolbar.style.bottom = `${bottombarHeight - position.clientHeight}px`;
        vditorToolbar.style.top = 'auto';
      }
      return;
    }

    postBottombar.style.top = `${height - bottombarHeight + y}px`;
    if (vditorToolbar && action === 'select') {
      vditorToolbar.style.display = 'flex';
      vditorToolbar.style.position = 'fixed';
      vditorToolbar.style.top = `${toolbarTop + y}px`;
    }

    // if (!position) return;
    // if (action === 'select') {
    //   position.style.display = 'none';
    // } else position.style.display = 'flex';
  }
  setBottomFixed = (action) => {
    const timer = setTimeout(() => {
      if (timer) clearTimeout(timer);
      this.setBottomBarStyle(0, action);
    }, 100);
  }
  clearBottomFixed = () => {
    if (!isIOS()) return;
    const timer = setTimeout(() => {
      if (timer) clearTimeout(timer);
      document.querySelector('#dzq-vditor .vditor-bubble-toolbar').display = 'none';
      const height = getVisualViewpost();
      const postBottombar = document.querySelector('#post-bottombar');
      postBottombar.style.top = `calc(${height - postBottombar.clientHeight}px - constant(safe-area-inset-bottom))`;
      postBottombar.style.top = `calc(${height - postBottombar.clientHeight}px - env(safe-area-inset-bottom))`;
    }, 100);
  }

  // 分类
  handleCategoryClick = () => {
    this.props.handleSetState({ categoryChooseShow: true });
  };

  render() {
    const { threadPost, index, user } = this.props;
    const { threadExtendPermissions, permissions } = user;

    const { postData } = threadPost;
    const { emoji, topic, atList, currentDefaultOperation, currentAttachOperation, categoryChooseShow } = this.props;
    const category = ((index.categories && index.categories.slice()) || []).filter(item => item.name !== '全部');
    // 付费设置
    const { freeWords, price, attachmentPrice } = threadPost.postData;

    return (
      <>
        <Header
          isBackCustom={() => {
            this.props.handleSetState({ draftShow: true });
            return false;
          }}
        />
        <div className={styles['post-inner']}>
          {/* 标题 */}
          <Title
            isDisplay={this.props.isTitleShow}
            title={postData.title}
            onChange={title => this.props.setPostData({ title })}
          />
          {/* 编辑器 */}
          <DVditor
            value={postData.contentText}
            emoji={emoji}
            atList={atList}
            topic={topic}
            onChange={this.props.handleVditorChange}
            onFocus={(action) => {
              this.setBottomFixed(action);
              this.props.handleSetState({ isVditorFocus: true });
            }}
            onBlur={() => {
              this.props.handleSetState({ isVditorFocus: false });
              this.clearBottomFixed();
            }}
          />
          {/* 图片 */}
          {(currentAttachOperation === THREAD_TYPE.image || Object.keys(postData.images).length > 0) && (
            <ImageUpload
              fileList={Object.values(postData.images)}
              onChange={fileList => this.props.handleUploadChange(fileList, THREAD_TYPE.image)}
              onComplete={(ret, file) => this.props.handleUploadComplete(ret, file, THREAD_TYPE.image)}
            />
          )}

          {/* 视频组件 */}
          {(postData.video && postData.video.thumbUrl) && (
            <VideoDisplay
              src={postData.video.thumbUrl}
              onDelete={() => this.props.setPostData({ video: {} })}
              onReady={this.props.onVideoReady} />
          )}
          {/* 录音组件 */}
          {(currentAttachOperation === THREAD_TYPE.voice && !postData.audio.mediaUrl) && (
            <div className={styles['audio-record']}>
              <AudioRecord duration={60} onUpload={(blob) => {
                this.props.handleAudioUpload(blob);
              }} />
            </div>
          )}

          {/* 语音组件 */}
          {(Boolean(postData.audio.mediaUrl)) && (
            <div className={`${styles['audio-record']} ${styles['audio-record-display']}`}>
              <Audio src={postData.audio.mediaUrl} />
              <Icon className={styles.delete} name="DeleteOutlined" onClick={() => this.props.setPostData({ audio: {} })} />
            </div>
          )}

          {/* 附件上传组件 */}
          {(currentDefaultOperation === defaultOperation.attach || Object.keys(postData.files).length > 0) && (
            <FileUpload
              fileList={Object.values(postData.files)}
              onChange={fileList => this.props.handleUploadChange(fileList, THREAD_TYPE.file)}
              onComplete={(ret, file) => this.props.handleUploadComplete(ret, file, THREAD_TYPE.file)}
            />
          )}

          {/* 商品组件 */}
          {postData.product && postData.product.readyContent && (
            <Product
              good={postData.product}
              onDelete={() => this.props.setPostData({ product: {} })}
            />
          )}
          {((postData.rewardQa.value && postData.rewardQa.times)
            || postData.redpacket.price
            || !!(postData.price || postData.attachmentPrice)
          ) && (
            <MoneyDisplay
              postData={postData}
              setPostData={this.props.setPostData}
              handleSetState={this.props.handleSetState}
            />
          )}
        </div>
        <div id="post-bottombar" className={styles['post-bottombar']}>
          {/* 插入位置 */}
          <div id="post-position" className={styles['position-box']}>
            {/* <div className={styles['post-counter']}>还能输入{MAX_COUNT - this.props.count}个字</div> */}
            {(permissions?.insertPosition?.enable) && (<Position
              position={postData.position}
              onClick={() => this.props.saveDataLocal()}
              onChange={position => this.props.setPostData({ position })} />)}
            {/* <Position
              position={postData.position}
              onClick={() => this.props.saveDataLocal()}
              onChange={position => this.props.setPostData({ position })} /> */}
          </div>
          {/* 调整了一下结构，因为这里的工具栏需要固定 */}
          <AttachmentToolbar
            postData={postData}
            onAttachClick={this.props.handleAttachClick}
            // onUploadChange={this.handleUploadChange}
            onUploadComplete={this.props.handleVideoUploadComplete}
            category={
              <ToolsCategory
                categoryChoose={threadPost.categorySelected}
                onClick={this.handleCategoryClick} />}
            permission={threadExtendPermissions}
            currentSelectedToolbar={threadPost.currentSelectedToolbar}
          />
          {/* 默认的操作栏 */}
          <DefaultToolbar
            postData={postData}
            value={currentDefaultOperation}
            onClick={item => this.props.handleSetState({ currentDefaultOperation: item.id, emoji: {} })}
            permission={threadExtendPermissions}
            onSubmit={this.props.handleSubmit}>
            {/* 表情 */}
            <Emoji
              show={currentDefaultOperation === defaultOperation.emoji}
              emojis={threadPost.emojis}
              onClick={this.props.handleEmojiClick} />
          </DefaultToolbar>
        </div>
        {/* 选择帖子类别 */}
        <ClassifyPopup
          show={categoryChooseShow}
          category={category}
          categorySelected={threadPost.categorySelected}
          onVisibleChange={val => this.props.handleSetState({ categoryChooseShow: val })}
          onChange={(parent, child) => {
            this.props.setPostData({ categoryId: child.pid || parent.pid });
            threadPost.setCategorySelected({ parent, child });
          }}
        />
        {/* 插入 at 关注的人 */}
        {currentDefaultOperation === defaultOperation.at && (
          <AtSelect
            visible={currentDefaultOperation === defaultOperation.at}
            getAtList={this.props.handleAtListChange}
            onCancel={() => this.props.handleSetState({ currentDefaultOperation: '' })}
          />
        )}
        {/* 插入选中的话题 */}
        {currentDefaultOperation === defaultOperation.topic && (
          <TopicSelect
            visible={currentDefaultOperation === defaultOperation.topic}
            cancelTopic={() => this.props.handleSetState({ currentDefaultOperation: '' })}
            clickTopic={val => this.props.handleSetState({ topic: val })}
          />
        )}
        {/* 付费选择 */}
        {currentDefaultOperation === defaultOperation.pay && (
          <PostPopup
            list={this.props.paySelectText}
            onClick={val => this.props.handleSetState({ curPaySelect: val })}
            cancel={() => this.props.handleSetState({ currentDefaultOperation: '' })}
            visible={currentDefaultOperation === defaultOperation.pay}
          />
        )}
        {/* 是否保存草稿 */}
        {this.props.draftShow && (
          <PostPopup
            list={['保存草稿', '不保存草稿']}
            onClick={val => this.handleDraft(val)}
            cancel={() => this.handleDraft()}
            visible={this.props.draftShow}
          />
        )}
        {/* 悬赏问答 */}
        {currentAttachOperation === THREAD_TYPE.reward && (
          <ForTheForm
            confirm={(data) => {
              this.props.setPostData({ rewardQa: data });
              this.props.handleSetState({ currentAttachOperation: false });
            }}
            cancel={() => {
              this.props.handleSetState({
                currentAttachOperation: false,
              });
            }}
            data={postData.rewardQa}
          />
        )}
        {/* 插入红包 */}
        {currentDefaultOperation === defaultOperation.redpacket && (
          <RedpacketSelect
            data={postData.redpacket}
            cancel={() => this.props.handleSetState({ currentDefaultOperation: '' })}
            confirm={data => this.props.setPostData({ redpacket: data })}
          />
        )}
        {/* 插入商品 */}
        {currentAttachOperation === THREAD_TYPE.goods && (
          <ProductSelect onAnalyseSuccess={
            (data) => {
              this.props.handleSetState({ currentAttachOperation: false });
              this.props.setPostData({ product: data });
            }}
            cancel={() => this.props.handleSetState({ currentAttachOperation: false })}
          />
        )}
        {/* 付费设置 */}
        {this.props.curPaySelect && (
          <AllPostPaid
            exhibition={this.props.curPaySelect}
            cancle={() => {
              this.props.handleSetState({ curPaySelect: '', currentDefaultOperation: '' });
            }}
            data={{ freeWords, price, attachmentPrice }}
            confirm={(data) => {
              console.log(data);
              this.props.setPostData({ ...data });
            }}
          />
        )}
      </>
    );
  }
}

export default withRouter(ThreadCreate);
