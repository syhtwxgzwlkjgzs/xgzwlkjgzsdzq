import React from 'react';
import Router from '@discuzq/sdk/dist/router';
import Toast from '@discuzq/design/dist/components/toast';
import Icon from '@discuzq/design/dist/components/icon';
import { inject, observer } from 'mobx-react';
import BottomEvent from './bottom-event';
import UserInfo from './user-info';
import NoData from '../no-data';
import styles from './index.module.scss';
import goToLoginPage from '@common/utils/go-to-login-page';
import threadPay from '@common/pay-bussiness/thread-pay';
import ThreadCenterView from './ThreadCenterView';
import { debounce, noop } from './utils'
import { View, Text } from '@tarojs/components'
import { getImmutableTypeHeight } from './getHeight'
import { getElementRect, randomStr } from './utils'

@inject('site')
@inject('index')
@inject('user')
@inject('thread')
@inject('search')
@inject('topic')
@observer
class Index extends React.Component {
    

    constructor(props) {
      super(props);

      this.state = {
        isSendingLike: false,
        minHeight: 0
      }

      this.threadStyleId = `thread-style-id-${randomStr()}`

      this.textH = 0

      this.videoH = 0
  }

    componentDidMount() {

      const height = getImmutableTypeHeight(this.props.data)

      this.setState({ minHeight: height })
    }

    changeHeight = ({ type, height }) => {
      if (!height || height === 'NaN') {
        return
      }

      const minHeight = getImmutableTypeHeight(this.props.data)
      let newHeight = Number(height)
      let h = 0

      if (type === 'text') {
        this.textH = newHeight
        
        if (this.videoH !== 0) {
          h = this.videoH - 193
        }
        
      }

      if (type === 'video') {
        if (height && height !== 'NaN') {
          this.videoH = newHeight;
        }
        

        if (this.textH !== 0) {
          h = this.textH
        }

        h -= 193
      }

      this.setState({ minHeight: minHeight + newHeight + h})

      // getElementRect(this.threadStyleId).then(res => {
      //   debugger
      // })
    }

    // 评论
    onComment = (e) => {
      e && e.stopPropagation();

      const { threadId = '', ability } = this.props.data || {};
      const { canViewPost } = ability;

      // 没有查看权限，且未登录，需要去登录
      if (!canViewPost && !this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/subPages/user/wx-auth/index' });
        return;
      }

      if (threadId !== '') {
        this.props.thread.positionToComment()
        Router.push({url: `/subPages/thread/index?id=${threadId}`})
      } else {
        console.log('帖子不存在');
      }
    }
    // 点赞
    onPraise = (e) => {
      e && e.stopPropagation();
      this.handlePraise()
    }
    
    handlePraise = debounce(() => {

      if(this.state.isSendingLike) return;
      // 对没有登录的先登录
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/subPages/user/wx-auth/index' });
        return;
      }
      const { data = {}, user } = this.props;
      const { threadId = '', isLike, postId } = data;
      this.setState({isSendingLike: true});
      this.props.index.updateThreadInfo({ pid: postId, id: threadId, data: { attributes: { isLiked: !isLike } } }).then(result => {
        if (result.code === 0 && result.data) {
          this.props.index.updateAssignThreadInfo(threadId, { updateType: 'like', updatedInfo: result.data, user: user.userInfo });
          this.props.search.updateAssignThreadInfo(threadId, { updateType: 'like', updatedInfo: result.data, user: user.userInfo });
          this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'like', updatedInfo: result.data, user: user.userInfo });
          this.props.user.updateAssignThreadInfo(threadId, { updateType: 'like', updatedInfo: result.data, user: user.userInfo });
        }
        this.setState({isSendingLike: false});
      });
    }, 1000)

    // 支付
    onPay = (e) => {
      // e && e.stopPropagation();
      this.handlePay()
    }
    handlePay = debounce(async (e) => {
      // e && e.stopPropagation();

      // 对没有登录的先做
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/subPages/user/wx-auth/index' });
        return;
      }

      if (this.props.payType === '0') {
        return;
      }

      const thread = this.props.data;
      const { success } = await threadPay(thread, this.props.user?.userInfo);

      // 支付成功重新请求帖子数据
      if (success && thread?.threadId) {
        const { code, data } = await this.props.thread.fetchThreadDetail(thread?.threadId);
        if (code === 0 && data) {
          this.props.index.updatePayThreadInfo(thread?.threadId, data)
          this.props.search.updatePayThreadInfo(thread?.threadId, data)
          this.props.topic.updatePayThreadInfo(thread?.threadId, data)
          this.props.user.updatePayThreadInfo(thread?.threadId, data)
        }
      }
    }, 1000);

    onClick = (e) => {
      const { threadId = '', ability } = this.props.data || {};
      const { canViewPost } = ability;

      if (!canViewPost) {
        Toast.info({ content: '暂无权限查看详情，请联系管理员' });
        return
      }

      if (threadId !== '') {
        this.props.thread.isPositionToComment = false;
        Router.push({url: `/subPages/thread/index?id=${threadId}`})

        this.props.index.updateAssignThreadInfo(threadId, { updateType: 'viewCount' })
        this.props.search.updateAssignThreadInfo(threadId, { updateType: 'viewCount' })
        this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'viewCount' })
      } else {
        console.log('帖子不存在');
      }

      // 执行外部传进来的点击事件
      const { onClick } = this.props;
      if (typeof(onClick) === 'function') {
        onClick(this.props.data);
      }
    }

    onUser = (e) => {
      e && e.stopPropagation();

      const { user = {}, isAnonymous } = this.props.data || {};
      if (!!isAnonymous) {
        this.onClick()
      } else {
        Router.push({url: `/subPages/user/index?id=${user?.userId}`});
      }
    }

    onClickHeaderIcon = (e) => {
      e && e.stopPropagation();

      const { onClickIcon = noop } = this.props;
      onClickIcon(e)
    }

    render() {
      const { data, className = '', site = {}, showBottomStyle = true, isShowIcon = false, unifyOnClick = null, relativeToViewport = true } = this.props;

      const { platform = 'pc' } = site;
      if (!data) {
        return <NoData />;
      }
      const {
        user = {},
        position = {},
        likeReward = {},
        viewCount,
        group,
        createdAt,
        isLike,
        postId,
        threadId,
        displayTag,
        payType,
        content,
        isAnonymous,
        diffTime
      } = data || {};
      const {text} = content
      const { isEssence, isPrice, isRedPack, isReward } = displayTag;
      const {getShareData, getShareContent} = this.props.user
      const {shareNickname, shareAvatar, shareThreadid, shareContent} = this.props.user
      const { minHeight } = this.state

      return (
        <View className={`${styles.container} ${className} ${showBottomStyle && styles.containerBottom} ${platform === 'pc' && styles.containerPC}`} style={{ minHeight: `${minHeight}px` }} id={this.threadStyleId}>
          {
          relativeToViewport && (
            <>
            <View className={styles.header} onClick={unifyOnClick || this.onClick}>
                <UserInfo
                  name={user.nickname || ''}
                  avatar={user.avatar || ''}
                  location={position.location}
                  view={`${viewCount}`}
                  groupName={group?.groupName}
                  time={diffTime}
                  isEssence={isEssence}
                  isPay={isPrice}
                  isRed={isRedPack}
                  isReward={isReward}
                  isAnonymous={isAnonymous}
                  userId={user?.userId}
                  platform={platform}
                  onClick={unifyOnClick || this.onUser}
                />
                {isShowIcon && <View className={styles.headerIcon} onClick={unifyOnClick || this.onClickHeaderIcon}><Icon name='CollectOutlinedBig' className={styles.collectIcon}></Icon></View>}
            </View>

            <ThreadCenterView text={text} data={data} onClick={unifyOnClick || this.onClick} onPay={unifyOnClick || this.onPay} platform={platform} relativeToViewport={relativeToViewport} changeHeight={this.changeHeight} />

            <BottomEvent
              userImgs={likeReward.users}
              wholeNum={likeReward.likePayCount || 0}
              comment={likeReward.postCount || 0}
              sharing={likeReward.shareCount || 0}
              // onShare={this.onShare}
              onComment={this.onComment}
              onPraise={this.onPraise}
              unifyOnClick={unifyOnClick}
              isLiked={isLike}
              isSendingLike={this.state.isSendingLike}
              tipData={{ postId, threadId, platform, payType }}
              platform={platform}
              index={this.props.index}
              shareNickname = {shareNickname}
              shareAvatar = {shareAvatar}
              shareThreadid = {shareThreadid}
              getShareData = {getShareData}
              shareContent = {shareContent}
              getShareContent = {getShareContent}
              data={data}
              user={this.props.user}
            />
            </>
          )
        }
        </View>
      );
    }
}

// eslint-disable-next-line new-cap
export default Index;
