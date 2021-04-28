import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Header from '@components/header';
import DVditor from '@components/editor';
import Title from '@components/thread-post-pc/title';
import { AttachmentToolbar, DefaultToolbar } from '@components/editor/toolbar';
import Position from '@components/thread-post/position';
import { Button, Video, Audio, AudioRecord, Tag } from '@discuzq/design';
import ClassifyPopup from '@components/thread-post/classify-popup';
import { withRouter } from 'next/router';
import Emoji from '@components/editor/emoji';
import ImageUpload from '@components/thread-post/image-upload';
import { defaultOperation } from '@common/constants/const';
import FileUpload from '@components/thread-post/file-upload';
import { THREAD_TYPE } from '@common/constants/thread-post';
import Product from '@components/thread-post/product';
import ProductSelect from '@components/thread-post/product-select';
import AllPostPaid from '@components/thread/all-post-paid';
import AtSelect from '@components/thread-post/at-select';
import TopicSelect from '@components/thread-post/topic-select';
import RedpacketSelect from '@components/thread-post/redpacket-select';
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
      emoji,
      topic,
      atList,
      currentDefaultOperation,
      currentAttachOperation,
    } = this.props;
    const { postData } = threadPost;
    const { freeWords, price, attachmentPrice } = threadPost.postData;

    return (
      <>
        <Header />
        <div className={styles.wrapper}>
          <div className={styles['wrapper-inner']}>
            <Title pc isDisplay={true} />
            <div className={styles.editor}>
              <DVditor
                pc
                emoji={emoji}
                atList={atList}
                topic={topic}
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

              {/* 设置的金额相关展示 */}
              <div className={styles['money-box']}>
                {/* 付费 */}
                {!!(postData.price || postData.attachmentPrice) && (
                  <Tag>付费总额{postData.price + postData.attachmentPrice}元</Tag>
                )}
                <Tag>
                  {postData.redpacket.rule === 1 ? '随机红包' : '定额红包'}
                  \ 总金额{postData.redpacket.price}元\{postData.redpacket.number}个
                  {postData.redpacket.condition === 1 && `\\集赞个数${postData.redpacket.likenum}`}
                </Tag>
              </div>
            </div>
            <div className={styles.toolbar}>
              <div className={styles['toolbar-left']}>
                <DefaultToolbar
                  pc
                  value={currentDefaultOperation}
                  onClick={
                    (item, child) => {
                      if (child && child.id) {
                        this.props.handleSetState({ curPaySelect: child.id, emoji: {} });
                      } else {
                        this.props.handleSetState({ currentDefaultOperation: item.id, emoji: {} });
                      }
                    }
                  }
                  onSubmit={this.props.handleSubmit}>
                  {/* 表情 */}
                  <Emoji
                    pc
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
                <Position
                  position={postData.position}
                  onClick={() => this.props.saveDataLocal()}
                  onChange={position => this.props.setPostData({ position })}
                />
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
          {/* 插入付费 */}
          {!!this.props.curPaySelect && (
            <AllPostPaid
              pc
              visible={!!this.props.curPaySelect}
              exhibition={this.props.curPaySelect}
              cancle={() => {
                this.props.handleSetState({ curPaySelect: '', currentDefaultOperation: '' });
              }}
              data={{ freeWords, price, attachmentPrice }}
              confirm={(data) => {
                this.props.setPostData({ ...data });
              }}
            />
          )}
          {/* 插入 at 关注的人 */}
          {currentDefaultOperation === defaultOperation.at && (
            <AtSelect
              pc
              visible={currentDefaultOperation === defaultOperation.at}
              getAtList={list => this.props.handleAtListChange(list)}
              onCancel={() => this.props.handleSetState({ currentDefaultOperation: '' })}
            />
          )}
          {/* 插入选中的话题 */}
          {currentDefaultOperation === defaultOperation.topic && (
            <TopicSelect
              pc
              visible={currentDefaultOperation === defaultOperation.topic}
              cancelTopic={() => this.props.handleSetState({ currentDefaultOperation: '' })}
              clickTopic={val => this.props.handleSetState({ topic: val })}
            />
          )}
          {/* 插入红包 */}
          {currentDefaultOperation === defaultOperation.redpacket && (
            <RedpacketSelect
              pc
              visible={currentDefaultOperation === defaultOperation.redpacket}
              data={postData.redpacket}
              cancel={() => this.props.handleSetState({ currentDefaultOperation: '' })}
              confirm={data => this.props.setPostData({ redpacket: data })}
            />
          )}
        </div>
      </>
    );
  }
}

export default withRouter(ThreadPCPage);
