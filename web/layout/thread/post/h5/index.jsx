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
import { Video, Audio, AudioRecord } from '@discuzq/design';
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

const maxCount = 5000;

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
    this.captcha = '';
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
    // 悬赏问答
    if (currentAttachOperation === THREAD_TYPE.reward) return (
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
    );
    // 插入商品
    if (currentAttachOperation === THREAD_TYPE.goods) return (
      <ProductSelect onAnalyseSuccess={
        (data) => {
          this.props.handleSetState({ currentAttachOperation: false });
          this.props.setPostData({ product: data });
        }}
        cancel={() => this.props.handleSetState({ currentAttachOperation: false })}
      />
    );
    // 插入红包
    if (currentDefaultOperation === defaultOperation.redpacket) return (
      <RedpacketSelect
        data={postData.redpacket}
        cancel={() => this.props.handleSetState({ currentDefaultOperation: '' })}
        confirm={data => this.props.setPostData({ redpacket: data })}
      />
    );
    // 付费设置
    const { freeWords, price, attachmentPrice } = threadPost.postData;
    if (this.props.curPaySelect) return (
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
    );

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
            isDisplay={true}
            title={postData.title}
            onChange={title => this.props.setPostData({ title })}
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
            onChange={this.props.handleVditorChange}
            onFocus={() => {
              this.setBottomFixed();
              this.props.handleSetState({ isVditorFocus: true });
            }}
            onBlur={() => {
              this.props.handleSetState({ isVditorFocus: false });
              this.clearBottomFixed();
            }}
            onCountChange={count => this.props.handleSetState({ count })}
          />

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
            <div className={styles['audio-record']}>
              <Audio src={postData.audio.mediaUrl} />
            </div>
          )}

          {(currentAttachOperation === THREAD_TYPE.image || Object.keys(postData.images).length > 0) && (
            <ImageUpload
              fileList={Object.values(postData.images)}
              onChange={fileList => this.props.handleUploadChange(fileList, THREAD_TYPE.image)}
              onComplete={(ret, file) => this.props.handleUploadComplete(ret, file, THREAD_TYPE.image)}
            />
          )}

          {/* 视频组件 */}
          {(postData.video && postData.video.thumbUrl) && (
            <Video className="dzq-post-video" src={postData.video.thumbUrl} onReady={this.props.onVideoReady} />
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
          {/* 付费 */}
          {!!(postData.price || postData.attachmentPrice) && (
            <div className={styles['reward-qa-box']}>
              <div className={styles['reward-qa-box-content']}>
                付费总额{postData.price + postData.attachmentPrice}元
              </div>
            </div>
          )}
          {/* 悬赏问答内容标识 */}
          {(postData.rewardQa.value && postData.rewardQa.times) && (
            <div className={styles['reward-qa-box']}>
              <div className={styles['reward-qa-box-content']} onClick={() => {
                this.props.handleSetState({ rewardQaShow: true });
              }}>{`悬赏金额${postData.rewardQa.value}元\\结束时间${postData.rewardQa.times}`}</div>
            </div>
          )}
          {/* 红包信息 */}
          {postData.redpacket.price && (
            <div className={styles['reward-qa-box']}>
              <div className={styles['reward-qa-box-content']} onClick={() => this.props.handleSetState({ redpacketSelectShow: true })}>
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
            <div className={styles['post-counter']}>还能输入{maxCount - this.props.count}个字</div>
            {(permissions?.insertPosition?.enable) && (<Position
              position={postData.position}
              onClick={() => this.props.saveDataLocal()}
              onChange={position => this.props.setPostData({ position })} />)}

          </div>
          {/* 调整了一下结构，因为这里的工具栏需要固定 */}
          <AttachmentToolbar
            onAttachClick={this.props.handleAttachClick}
            // onUploadChange={this.handleUploadChange}
            onUploadComplete={this.props.handleVideoUploadComplete}
            category={
              <ToolsCategory
                categoryChoose={threadPost.categorySelected}
                onClick={this.handleCategoryClick} />}
            permission={threadExtendPermissions}
          />
          {/* 默认的操作栏 */}
          <DefaultToolbar
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
      </>
    );
  }
}

export default withRouter(ThreadCreate);
