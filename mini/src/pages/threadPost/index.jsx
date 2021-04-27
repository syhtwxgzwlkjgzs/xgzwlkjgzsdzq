import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { PluginToolbar, DefaultToolbar, GeneralUpload, Tag, Title, Content, ClassifyPopup, PaidTypePopup, Position, Emoji } from '@components/thread-post';
import { Popup } from '@discuzq/design';
import { Units } from '@components/common';
import styles from './index.module.scss';
import { THREAD_TYPE } from '@common/constants/thread-post';
import { readYundianboSignature } from '@common/server';
import VodUploader from 'vod-wx-sdk-v2';
import Router from '@discuzq/sdk/dist/router';
import Page from '@components/page';

@inject('index')
@inject('site')
@inject('threadPost')
@observer
class Index extends Component {
  constructor() {
    super();
    this.state = {
      postType: 'post', // 发布类型 post-首次发帖，edit-再次编辑，draft-草稿
      title: '',
      isShowTitle: true, // 默认显示标题
      showClassifyPopup: false, // 切换分类弹框show
      operationType: 0,
      contentTextLength: 5000,
      showEmoji: false
    }
  }

  componentWillMount() { }

  componentDidMount() {
    this.fetchCategories();
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 若当前store内分类列表数据为空，则主动发起请求
  fetchCategories() {
    const { categories, getReadCategories } = this.props.index;
    if (!categories || (categories && categories?.length === 0)) {
      getReadCategories();
    }
  }

  // handle
  onTitleInput = (title) => {
    const { setPostData } = this.props.threadPost;
    setPostData({ title });
  }

  // 处理文本框内容
  onContentChange = (contentText, maxLength) => {
    const { setPostData } = this.props.threadPost;
    setPostData({ contentText });
    this.setState({
      contentTextLength: maxLength - contentText.length
    });
  }

  onContentFocus = () => {
    // 首次发帖，文本框聚焦时，若标题为空，则此次永久隐藏标题输入
    const { postData } = this.props.threadPost;
    if (this.state.postType === 'post' && postData.title === "") {
      this.setState({ isShowTitle: false })
    }
  }

  // 设置当前选中分类、分类id
  onClassifyChange = ({ parent, child }) => {
    const { setPostData, setCategorySelected } = this.props.threadPost;
    setPostData({ categoryId: child.pid || parent.pid });
    setCategorySelected({ parent, child });
  }

  // 点击发帖插件时回调，如上传图片、视频、附件或艾特、话题等
  handlePluginClick(item) {
    this.setState({
      operationType: item.type
    });

    let nextRoute;
    switch (item.type) {
      //  其它类型可依次补充
      case THREAD_TYPE.reward:
        nextRoute = '/pages/threadPost/selectReward';
        break;
      case THREAD_TYPE.goods:
        nextRoute = '/pages/threadPost/selectProduct';
        break;
      case THREAD_TYPE.video:
        this.handleVideoUpload();
        break;
      case THREAD_TYPE.redPacket:
        nextRoute = '/pages/threadPost/selectRedpacket';
        break;
      case THREAD_TYPE.paid:
        this.setState({ showPaidType: true });
        break;
      case THREAD_TYPE.paidPost:
        nextRoute = `/pages/threadPost/selectPaid?paidType=${THREAD_TYPE.paidPost}`;
        this.setState({ showPaidType: false })
        break;
      case THREAD_TYPE.paidAttachment:
        nextRoute = `/pages/threadPost/selectPaid?paidType=${THREAD_TYPE.paidAttachment}`;
        this.setState({ showPaidType: false });
        break;
      case THREAD_TYPE.at:
        nextRoute = '/pages/threadPost/selectAt';
        break;
      case THREAD_TYPE.topic:
        nextRoute = '/pages/threadPost/selectTopic';
        break;
      case THREAD_TYPE.emoji:
        this.setState({
          showEmoji: true
        });
        break;
    }

    if (nextRoute) Taro.navigateTo({ url: nextRoute });

  }

  // 执行上传视频
  handleVideoUpload = () => {
    const { setPostData } = this.props.threadPost;
    Taro.chooseVideo({
      success: (file) => {
        Taro.showLoading({
          title: '上传中',
          mask: true
        });
        // 执行云点播相关的上传工作
        VodUploader.start({
          // 必填，把 wx.chooseVideo 回调的参数(file)传进来
          mediaFile: file,
          // 必填，获取签名的函数
          getSignature: async (fn) => {
            const res = await readYundianboSignature();
            const { code, data } = res;
            if (code === 0) {
              fn(data.token);
            } else {
              Taro.showToast({
                title: '上传失败',
                duration: 2000
              });
            }
          },
          // 上传中回调，获取上传进度等信息
          progress: function (result) {
            console.log('progress');
            console.log(result);
          },
          // 上传完成回调，获取上传后的视频 URL 等信息
          finish: function (result) {
            Taro.hideLoading();
            setPostData({
              video: result
            });
            console.log('finish');
            console.log(result);
          },
          // 上传错误回调，处理异常
          error: function (result) {
            Taro.showToast({
              title: '上传失败',
              duration: 2000
            });
            console.log('error');
            console.log(result);
          },
        });
      }
    });
  }

  // 红包tag展示
  redpacketContent = () => {
    const { redpacket: { rule, orderPrice, number } } = this.props.threadPost.postData;
    return `${rule === 1 ? '随机红包' : '定额红包'}\\总金额 ${orderPrice}元\\${number}个`
  }

  render() {
    const { categories } = this.props.index;
    const { postData, setPostData } = this.props.threadPost;
    const { rewardQa, redpacket, video, product, position } = postData;
    const {
      title,
      isShowTitle,
      showClassifyPopup,
      operationType,
      showPaidType,
      contentTextLength,
      showEmoji,
    } = this.state;
    return (
      <Page>
        <View className={styles['container']}>
          {/* 内容区域，inclue标题、帖子文字、图片、附件、语音等 */}
          <View className={styles['content']}>
            <Title title={title} show={isShowTitle} onInput={this.onTitleInput} />
            <Content
              value={postData.contentText}
              onChange={this.onContentChange}
              onFocus={this.onContentFocus}
            />

            <View className={styles['plugin']}>

              <GeneralUpload type={operationType} />

              {product.detailContent && <Units type='product' productSrc={product.imagePath} productDesc={product.title} productPrice={product.price} onDelete={() => {}} />}

              {video.videoUrl && <Units type='video' src={video.videoUrl} />}



            </View>
          </View>

          {/* 工具栏区域、include各种插件触发图标、发布等 */}
          <View className={styles['toolbar']}>
            <View className={styles['location-bar']}>
              <Position currentPosition={position} positionChange={(position) => {
                setPostData({position});
              }} />
              <Text className={styles['text-length']}>{`还能输入${contentTextLength}个字`}</Text>
            </View>


            <View className={styles['tag-toolbar']}>
              {/* 插入付费tag */}
              {(Boolean(postData.price || postData.attachmentPrice)) && (
                <Units
                  type='tag'
                  tagContent={`付费总额${postData.price + postData.attachmentPrice}元`}
                  onTagClick={() => this.handlePluginClick({ type: THREAD_TYPE.paid })}
                />
              )}
              {/* 红包tag */}
              {redpacket.money &&
                <Units
                  type='tag'
                  tagContent={this.redpacketContent()}
                  onTagClick={() => this.handlePluginClick({ type: THREAD_TYPE.redPacket })}
                />
              }
              {/* 悬赏tag */}
              {rewardQa.price &&
                <Units
                  type='tag'
                  tagContent={`悬赏金额${rewardQa.price}元\\结束时间${rewardQa.expiredAt}`}
                  onTagClick={() => this.handlePluginClick({ type: THREAD_TYPE.reward })}
                />
              }
            </View>
            <PluginToolbar
              clickCb={(item) => {
                this.handlePluginClick(item);
              }}
              onCategoryClick={() => this.setState({ showClassifyPopup: true })}
            />
            <DefaultToolbar clickCb={(item) => {
              this.handlePluginClick(item);
            }} />
          </View>
        </View>

        {/* 二级分类弹框 */}
        <ClassifyPopup
          show={showClassifyPopup}
          category={categories}
          onHide={() => this.setState({ showClassifyPopup: false })}
          onChange={this.onClassifyChange}
        />
        {/* 选择付费类型弹框 */}
        <PaidTypePopup
          show={showPaidType}
          onClick={(item) => this.handlePluginClick(item)}
          onHide={() => this.setState({ showPaidType: false })}
        />

        <Emoji show={showEmoji} onHide={() => {
          this.setState({
            showEmoji: false
          });
        }} />

      </Page>
    );
  }
}

export default Index;
