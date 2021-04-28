import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Header from '@components/header';
import DVditor from '@components/editor';
import Title from '@components/thread-post-pc/title';
import { AttachmentToolbar, DefaultToolbar } from '@components/editor/toolbar';
import Position from '@components/thread-post/position';
import { Button, Video, Audio, AudioRecord } from '@discuzq/design';
import ClassifyPopup from '@components/thread-post/classify-popup';
import { withRouter } from 'next/router';
import Emoji from '@components/editor/emoji';
import ImageUpload from '@components/thread-post/image-upload';
import { defaultOperation } from '@common/constants/const';
import FileUpload from '@components/thread-post/file-upload';
import { THREAD_TYPE } from '@common/constants/thread-post';
import Product from '@components/thread-post/product';
import ProductSelect from '@components/thread-post/product-select';
import Copyright from '@components/copyright';

@inject('threadPost')
@inject('index')
@inject('thread')
@observer
class ThreadPCPage extends React.Component {
  render() {
    const {
      threadPost,
      index,
      // emoji,
      // topic,
      // atList,
      currentDefaultOperation,
      currentAttachOperation,
    } = this.props;
    const { postData } = threadPost;

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
              {/* 录音组件 */}
              {(currentAttachOperation === THREAD_TYPE.voice) && (
                  <AudioRecord handleAudioBlob={(blob) => {
                    this.props.handleAudioUpload(blob);
                  }}
                />
              )}
              {/* 语音组件 */}
              {(Boolean(postData.audio.mediaUrl))
                && (<Audio src={postData.audio.mediaUrl} />)}

              {/* 插入图片 */}
              {(currentAttachOperation === THREAD_TYPE.image
                || Object.keys(postData.images).length > 0) && (
                <ImageUpload
                  fileList={Object.values(postData.images)}
                  onChange={fileList => this.props.handleUploadChange(fileList, THREAD_TYPE.image)}
                  onComplete={(ret, file) => this.props.handleUploadComplete(ret, file, THREAD_TYPE.image)}
                />
              )}

              {/* 视频组件 */}
              {(postData.video && postData.video.thumbUrl) && (
                <Video className="dzq-post-video" src={postData.video.thumbUrl} onReady={this.props.onReady} />
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
                  pc
                  good={postData.product}
                  onDelete={() => this.props.setPostData({ product: {} })}
                />
              )}
            </div>
            <div className={styles.toolbar}>
              <div className={styles['toolbar-left']}>
                <DefaultToolbar
                  pc
                  value={currentDefaultOperation}
                  onClick={
                    item => this.props.handleSetState({ currentDefaultOperation: item.id, emoji: {} })
                  }
                  onSubmit={this.props.handleSubmit}>
                  {/* 表情 */}
                  <Emoji
                    show={currentDefaultOperation === defaultOperation.emoji}
                    emojis={threadPost.emojis}
                    onClick={this.props.handleEmojiClick} />
                </DefaultToolbar>
                <div className={styles.divider}></div>
                <AttachmentToolbar
                  pc
                  onAttachClick={this.props.handleAttachClick}
                  onUploadComplete={this.props.handleVideoUploadComplete}
                />
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
                this.props.setPostData({ categoryId: child.pid || parent.pid });
                threadPost.setCategorySelected({ parent, child });
              }}
            />
            <div className={styles.footer}>
              <Button type="info">保存至草稿箱</Button>
              <Button type="primary">发布</Button>
            </div>
          </div>
          <Copyright/>
          {/* 插入商品 */}
          <ProductSelect
            pc
            visible={currentAttachOperation === THREAD_TYPE.goods}
            onAnalyseSuccess={
              (data) => {
                this.props.handleSetState({ currentAttachOperation: false });
                this.props.setPostData({ product: data });
              }
            }
            cancel={() => this.props.handleSetState({ currentAttachOperation: false })}
          />
        </div>
      </>
    );
  }
}

export default withRouter(ThreadPCPage);
