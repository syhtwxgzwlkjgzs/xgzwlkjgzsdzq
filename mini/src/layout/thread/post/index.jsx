import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Icon } from '@discuzq/design';
import { observer, inject } from 'mobx-react';
import { PluginToolbar, DefaultToolbar, GeneralUpload, Title, Content, ClassifyPopup, OptionPopup, Position, Emoji } from '@components/thread-post';
import { Units } from '@components/common';
import styles from './index.module.scss';
import { THREAD_TYPE } from '@common/constants/thread-post';
import { paidOption, draftOption } from '@common/constants/const';
import { readYundianboSignature } from '@common/server';
import VodUploader from 'vod-wx-sdk-v2';
import { toTCaptcha } from '@common/utils/to-tcaptcha'
import PayBox from '@components/payBox/index';
import { ORDER_TRADE_TYPE } from '@common/constants/payBoxStoreConstants';

@inject('index')
@inject('site')
@inject('user')
@inject('thread')
@inject('threadPost')
@observer
class Index extends Component {
  constructor() {
    super();
    this.state = {
      threadId: '', // 主题id
      postType: 'isFirst', // 发布状态 isFirst-首次，isEdit-再编辑，isDraft-草稿
      isShowTitle: true, // 默认显示标题
      maxLength: 5000, // 文本输入最大长度
      showClassifyPopup: false, // 切换分类弹框show
      operationType: 0,
      contentTextLength: 5000,
      showEmoji: false,
      showPaidOption: false, // 显示付费选项弹框
      showDraftOption: false, // 显示草稿选项弹框
      bottomHeight: 0,
      isFirstFocus: true, // textarea首次聚焦(处理调用键盘弹起API首次返回数据不准确的情况)
    }
    this.timer = null;
    this.ticket = ''; // 腾讯云验证码返回票据
    this.randstr = ''; // 腾讯云验证码返回随机字符串
  }

  componentWillMount() { }

  async componentDidMount() {
    // 监听键盘高度变化
    Taro.onKeyboardHeightChange(res => {
      this.setState({ bottomHeight: res?.height || 0 });
    });

    this.redirectToHome();
    await this.fetchCategories(); // 请求分类
    const { params } = getCurrentInstance().router;
    const id = parseInt(params.id);
    if (id) { // 请求主题
      this.setState({ threadId: id, postType: 'isEdit' })
      this.setPostDataById(id);
    } else {
      this.openSaveDraft();
    }
    // 监听腾讯验证码事件
    Taro.eventCenter.on('captchaResult', this.handleCaptchaResult);
    Taro.eventCenter.on('closeChaReault', this.handleCloseChaReault);
  }

  componentDidUpdate() {
    this.redirectToHome();
  }

  componentWillUnmount() {
    // 卸载发帖页时清理定时器、事件监听、重置发帖数据
    const { resetPostData } = this.props.threadPost;
    resetPostData();
    clearInterval(this.timer);
    Taro.eventCenter.off('captchaResult', this.handleCaptchaResult);
    Taro.eventCenter.off('closeChaReault', this.handleCloseChaReault);
    // Taro.offKeyboardHeightChange(() => {});
  }

  componentDidShow() { }

  componentDidHide() { }

  // handle
  postToast = (title, icon = 'none', duration = 2000) => { // toast
    Taro.showToast({ title, icon, duration });
  }

  redirectToHome = () => { // 检查发帖权限，没有则重定向首页
    const { permissions } = this.props.user;
    if (permissions && !permissions.createThread?.enable) {
      this.postToast('暂无发帖权限');
      Taro.redirectTo({ url: '/pages/index/index' })
    }
  }

  async fetchCategories() { // 若当前store内分类列表数据为空，则主动请求分类
    const { categories, getReadCategories } = this.props.index;
    if (!categories || (categories && categories?.length === 0)) {
      await getReadCategories();
    }
  }

  async setPostDataById(id) {
    const { thread, threadPost } = this.props;
    let ret = {};

    // 再编辑时，含有主题数据，直接使用
    if (id === thread.threadData?.id && thread.threadData) {
      ret.data = thread.threadData;
      ret.code = 0;
    } else {
      ret = await thread.fetchThreadDetail(id);
    }

    if (ret.code === 0) {
      // 请求成功，设置分类，发帖数据,发帖状态，草稿状态开启自动保存
      const { categoryId, isDraft } = ret.data;
      this.setCategory(categoryId);
      threadPost.formatThreadDetailToPostData(ret.data);
      this.setState({ postType: isDraft === 1 ? 'isDraft' : 'isEdit' });
      isDraft === 1 && this.openSaveDraft();
    } else {
      // 请求失败，弹出错误消息
      this.postToast(ret.msg);
    }
  }

  setCategory(categoryId) { // 设置当前主题已选分类
    const categorySelected = this.props.index.getCategorySelectById(categoryId);
    this.props.threadPost.setCategorySelected(categorySelected);
  }

  openSaveDraft = () => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.autoSaveDraft();
    }, 120000)
  }

  autoSaveDraft = async () => {
    const { postData, setPostData } = this.props.threadPost;
    if (postData.contentText.length === 0) return;
    !postData.draft && setPostData({ draft: 1 });
    this.handleSubmit(true);
  }

  // 监听title输入
  onTitleInput = (title) => {
    const { setPostData } = this.props.threadPost;
    setPostData({ title });
  }

  // 处理文本框内容
  onContentChange = (contentText, maxLength) => {
    const { setPostData } = this.props.threadPost;
    setPostData({ contentText });
    this.toHideTitle();
    // this.setState({
    //   contentTextLength: maxLength - contentText.length
    // });
  }

  // 设置当前选中分类、分类id
  onClassifyChange = ({ parent, child }) => {
    const { setPostData, setCategorySelected } = this.props.threadPost;
    setPostData({ categoryId: child.pid || parent.pid });
    setCategorySelected({ parent, child });
  }

  // 点击发帖插件时回调，如上传图片、视频、附件或艾特、话题等
  handlePluginClick(item) {
    const { postType } = this.state;
    this.setState({
      operationType: item.type
    });
    let nextRoute;
    switch (item.type) {
      // 根据类型分发具体操作
      case THREAD_TYPE.reward:
        if (postType === 'isEdit') {
          return this.postToast('再编辑时不可操作悬赏');
        }
        nextRoute = '/subPages/thread/selectReward/index';
        break;
      case THREAD_TYPE.goods:
        nextRoute = '/subPages/thread/selectProduct/index';
        break;
      case THREAD_TYPE.redPacket:
        if (postType === 'isEdit') {
          return this.postToast('再编辑时不可操作红包');
        }
        nextRoute = '/subPages/thread/selectRedpacket/index';
        break;
      case THREAD_TYPE.paid:
        this.setState({ showPaidOption: true });
        break;
      case THREAD_TYPE.paidPost:
        nextRoute = `/subPages/thread/selectPayment/index?paidType=${THREAD_TYPE.paidPost}`;
        this.setState({ showPaidOption: false })
        break;
      case THREAD_TYPE.paidAttachment:
        nextRoute = `/subPages/thread/selectPayment/index?paidType=${THREAD_TYPE.paidAttachment}`;
        this.setState({ showPaidOption: false });
        break;
      case THREAD_TYPE.at:
        nextRoute = '/subPages/thread/selectAt/index';
        break;
      case THREAD_TYPE.topic:
        nextRoute = '/subPages/thread/selectTopic/index';
        break;
      case THREAD_TYPE.draft:
        this.setState({ showDraftOption: true });
        break;
      case THREAD_TYPE.saveDraft:
        this.setState({ showDraftOption: false }, () => this.handleSaveDraft());
        break;
      case THREAD_TYPE.abandonDraft:
        this.setState({ showDraftOption: false }, () => this.handlePageJump(true));
        break;
      case THREAD_TYPE.video:
        this.handleVideoUpload();
        break;
      case 'emoji':
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
            result.id = result.fileId;
            setPostData({
              video: result
            });
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
    const { postData, redpacketTotalAmount: amount } = this.props.threadPost;
    const { redpacket: { rule, number } } = postData;
    return `${rule === 1 ? '随机红包' : '定额红包'}\\总金额 ${amount}元\\${number}个`;
  }

  // 验证码滑动成功的回调
  handleCaptchaResult = (result) => {
    this.ticket = result.ticket;
    this.randstr = result.randstr;
    this.handleSubmit();
  }

  // 验证码点击关闭的回调
  handleCloseChaReault = () => {
    Taro.hideLoading();
  }

  handleSubmit = async (isDraft) => {
    // 1 校验
    const { threadPost, site } = this.props;
    const { postData, redpacketTotalAmount } = threadPost;
    if (!isDraft && !postData.contentText) {
      this.postToast('请填写您要发布的内容');
      return;
    }
    // 2 验证码
    const { webConfig } = site;
    if (webConfig) {
      const qcloudCaptcha = webConfig?.qcloud?.qcloudCaptcha;
      const qcloudCaptchaAppId = webConfig?.qcloud?.qcloudCaptchaAppId;
      const createThreadWithCaptcha = webConfig?.other?.createThreadWithCaptcha;
      if (qcloudCaptcha && createThreadWithCaptcha) {
        if (!this.ticket || !this.randstr) {
          toTCaptcha(qcloudCaptchaAppId);
          return false;
        }
      }
    }
    // 3 将验证码信息更新到发布store
    const { setPostData } = threadPost;
    if (this.ticket && this.randstr) {
      setPostData({
        ticket: this.ticket,
        randstr: this.randstr,
      });
      this.ticket = '';
      this.randstr = '';
    }

    // 4 支付流程
    const { rewardQa } = postData;
    const rewardAmount = (Number(rewardQa.value) || 0);
    const redAmount = (Number(redpacketTotalAmount) || 0);
    const amount = rewardAmount + redAmount;
    const options = { amount };
    if (!isDraft && amount) {
      let type = ORDER_TRADE_TYPE.RED_PACKET;
      let title = '支付红包';
      if (redAmount) {
        options.redAmount = redAmount;
      }
      if (rewardAmount) {
        type = ORDER_TRADE_TYPE.POST_REWARD;
        title = '支付悬赏';
        options.rewardAmount = rewardAmount;
      }
      if (rewardAmount && redAmount) {
        type = ORDER_TRADE_TYPE.COMBIE_PAYMENT;
        title = '支付红包和悬赏';
      }

      // 等待支付
      await new Promise((resolve) => {
        PayBox.createPayBox({
          data: { ...options, title, type },
          success: async (orderInfo) => {
            const { orderSn } = orderInfo;
            setPostData({ orderSn });
            resolve();
          },
        });
      });
    }
    // 5 loading
    Taro.showLoading({
      title: isDraft ? '保存草稿中...' : '发布中...',
      mask: true
    });
    // 6 根据是否存在主题id，选择更新主题、新建主题
    let ret = {};
    const { threadId } = this.state;
    if (threadId) {
      ret = await threadPost.updateThread(threadId);
    } else {
      ret = await threadPost.createThread();
    }
    // 7 处理请求数据
    const { code, data, msg } = ret;
    if (code === 0) {
      if (!threadId) {
        this.setState({ threadId: data.threadId }); // 新帖首次保存草稿后，获取id
      }
      // 非草稿，跳转主题详情页
      Taro.hideLoading();
      if (!isDraft) {
        this.postToast('发布成功', 'success');
        Taro.redirectTo({ url: `/pages/thread/index?id=${data.threadId}` });
      }
      return true;
    } else {
      Taro.hideLoading();
      !isDraft && this.postToast(msg);
      return false;
    }

  }

  // 处理用户主动点击保存草稿
  handleSaveDraft = async () => {
    const { setPostData } = this.props.threadPost;
    setPostData({ draft: 1 });
    const isSuccess = await this.handleSubmit(true);

    if (isSuccess) {
      this.postToast('保存成功', 'success');
      setTimeout(() => {
        Taro.hideLoading();
        this.handlePageJump(true);
      }, 1000);
    } else {
      this.postToast('保存失败');
    }
  }

  // 首次发帖，文本框聚焦时，若标题为空，则此次永久隐藏标题输入
  toHideTitle = () => {
    const { postData } = this.props.threadPost;
    const { postType, isShowTitle } = this.state;
    if (
      postType === 'isFirst'
      && isShowTitle
      && postData.contentText !== ""
      && postData.title === ""
    ) {
      this.setState({ isShowTitle: false })
    }
  }

  // 手动关闭键盘
  hideKeyboard = () => {
    Taro.hideKeyboard({
      complete: res => {
        this.setState({ bottomHeight: 0 });
      }
    })
  }

  // 处理textarea聚焦
  onContentFocus = () => {
    if (this.state.isFirstFocus) {
      this.setState({ isFirstFocus: false });
    }
  }

  // 处理左上角按钮点击跳路由
  handlePageJump = async (canJump = false, url) => {
    if (!canJump) { // 无法跳转时，调用保存草稿选项框
      this.setState({ showDraftOption: true });
      return;
    }

    url ? Taro.redirectTo({ url }) : Taro.navigateBack();
  }

  render() {
    const { permissions } = this.props.user;
    const { categories } = this.props.index;
    const { postData, setPostData } = this.props.threadPost;
    const { rewardQa, redpacket, video, product, position } = postData;
    const {
      isShowTitle,
      maxLength,
      showClassifyPopup,
      operationType,
      showPaidOption,
      showEmoji,
      showDraftOption,
      bottomHeight,
    } = this.state;
    return (
      <>
        <View className={styles['container']}>
          {/* 自定义顶部导航条 */}
          <View className={styles.topBar}>
            <View
              className={styles['topBar-icon']}
              onClick={() => this.handlePageJump(false)}
            >
              <Icon name="RightOutlined" />
            </View>
            发帖
          </View>

          {/* 内容区域，inclue标题、帖子文字、图片、附件、语音等 */}
          <View className={styles['content']}>
            <Title
              title={postData.title}
              show={isShowTitle}
              onInput={this.onTitleInput}
              onBlur={this.hideKeyboard}
            />
            <Content
              value={postData.contentText}
              maxLength={maxLength}
              onChange={this.onContentChange}
              onFocus={this.onContentFocus}
              onBlur={this.hideKeyboard}
            />

            <View className={styles['plugin']}>

              <GeneralUpload type={operationType} />

              {product.detailContent && <Units type='product' productSrc={product.imagePath} productDesc={product.title} productPrice={product.price} onDelete={() => { }} />}

              {video.videoUrl && <Units type='video' deleteShow src={video.videoUrl} onDelete={() => setPostData({ video: {} })} />}

            </View>
          </View>

          {/* 插入内容tag展示区 */}
          <View className={styles['tags']}>
            {(permissions?.insertPosition?.enable) &&
              <View className={styles['location-bar']}>
                <Position currentPosition={position} positionChange={(position) => {
                  setPostData({ position });
                }} />
              </View>
            }

            {(Boolean(postData.price || postData.attachmentPrice) || redpacket.price || rewardQa.value) && (
              <View className={styles['tag-toolbar']}>
                {/* 插入付费tag */}
                {(Boolean(postData.price || postData.attachmentPrice)) && (
                  <Units
                    type='tag'
                    tagContent={`付费总额${postData.price + postData.attachmentPrice}元`}
                    onTagClick={() => this.handlePluginClick({ type: THREAD_TYPE.paid })}
                    onTagRemoveClick={() => {
                      setPostData({
                        price: 0,
                        attachmentPrice: 0
                      })
                    }}
                  />
                )}
                {/* 红包tag */}
                {redpacket.price &&
                  <Units
                    type='tag'
                    tagContent={this.redpacketContent()}
                    onTagClick={() => this.handlePluginClick({ type: THREAD_TYPE.redPacket })}
                    onTagRemoveClick={() => { setPostData({ redpacket: {} }) }}
                  />
                }
                {/* 悬赏tag */}
                {rewardQa.value &&
                  <Units
                    type='tag'
                    tagContent={`悬赏金额${rewardQa.value}元\\结束时间${rewardQa.expiredAt}`}
                    onTagClick={() => this.handlePluginClick({ type: THREAD_TYPE.reward })}
                    onTagRemoveClick={() => { setPostData({ rewardQa: {} }) }}
                  />
                }
              </View>
            )}
          </View>

          {/* 工具栏区域、include各种插件触发图标、发布等 */}
          <View
            className={styles.toolbar}
            style={{ transform: `translateY(-${bottomHeight}px)` }}
          >
            <PluginToolbar
              permissions={permissions}
              clickCb={(item) => {
                this.handlePluginClick(item);
              }}
              onCategoryClick={() => this.setState({ showClassifyPopup: true })}
            />
            <DefaultToolbar
              permissions={permissions}
              onPluginClick={(item) => {
                this.handlePluginClick(item);
              }}
              onSubmit={() => this.handleSubmit()}
            />
          </View>
        </View>

        {/* 二级分类弹框 */}
        <ClassifyPopup
          show={showClassifyPopup}
          category={categories}
          onHide={() => this.setState({ showClassifyPopup: false })}
          onChange={this.onClassifyChange}
        />
        {/* 主题付费选项弹框 */}
        <OptionPopup
          show={showPaidOption}
          list={paidOption}
          onClick={(item) => this.handlePluginClick(item)}
          onHide={() => this.setState({ showPaidOption: false })}
        />
        {/* 主题草稿选项弹框 */}
        <OptionPopup
          show={showDraftOption}
          list={draftOption}
          onClick={(item) => this.handlePluginClick(item)}
          onHide={() => this.setState({ showDraftOption: false })}
        />

        {/* 表情类型弹框 */}
        <Emoji show={showEmoji} onHide={() => {
          this.setState({
            showEmoji: false
          });
        }} />
      </>
    );
  }
}

export default Index;



