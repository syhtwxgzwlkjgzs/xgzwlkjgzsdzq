import React from 'react';
import Router from '@discuzq/sdk/dist/router';
import Toast from '@discuzq/design/dist/components/toast';
import Button from '@discuzq/design/dist/components/button';
import { inject, observer } from 'mobx-react';
import BottomEvent from './bottom-event';
import UserInfo from './user-info';
import NoData from '../no-data';
import styles from './index.module.scss';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import goToLoginPage from '@common/utils/go-to-login-page';
import threadPay from '@common/pay-bussiness/thread-pay';
import ThreadCenterView from './ThreadCenterView';
import { debounce } from './utils'
import { View, Text } from '@tarojs/components'

@inject('site')
@inject('index')
@inject('user')
@inject('thread')
@inject('search')
@inject('topic')
@observer
class Index extends React.Component {

    state = {
      isSendingLike: false,
    }

    // 分享
    onShare = (e) => {
      e && e.stopPropagation();
      this.handleShare()
    }
    handleShare = debounce(() => {
      
      // 对没有登录的先登录
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/subPages/user/wx-auth/index' });
        return;
      }

      // Toast.info({ content: '复制链接成功' });

      const { title = '', threadId = '', user } = this.props.data || {};

      // h5Share({path: `/thread/${threadId}`});
      this.props.index.updateThreadShare({ threadId }).then(result => {
        if (result.code === 0) {
          this.props.index.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.search.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
        }
      });
    }, 1000);
    // 评论
    onComment = (e) => {
      e && e.stopPropagation();

      // 对没有登录的先登录
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/subPages/user/wx-auth/index' });
        return;
      }

      const { data = {} } = this.props;
      const { threadId = '' } = data;
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
        }
        this.setState({isSendingLike: false});
      });
    }, 1000)

    // 支付
    onPay = (e) => {
      //e && e.stopPropagation();
      this.handlePay()
    }
    handlePay = debounce(async (e) => {
      //e && e.stopPropagation();

      // 对没有登录的先做
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/user/login' });
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
        }
      }
    }, 1000);

    onClick = (e) => {
      const { threadId = '', ability } = this.props.data || {};
      const { canViewPost } = ability;

      if (!canViewPost) {
        Toast.info({ content: '暂无权限查看详情，请联系管理员' });
      }

      if (threadId !== '') {
        Router.push({url: `/subPages/thread/index?id=${threadId}`})
      } else {
        console.log('帖子不存在');
      }

      // 执行外部传进来的点击事件
      const { onClick } = this.props;
      if (typeof(onClick) === 'function') {
        onClick(this.props.data);
      }
    }

    render() {
      const { data, className = '', site = {}, showBottomStyle = true } = this.props;
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
      } = data || {};
      const { isEssence, isPrice, isRedPack, isReward } = displayTag;

      return (
        <View className={`${styles.container} ${className} ${showBottomStyle && styles.containerBottom} ${platform === 'pc' && styles.containerPC}`}>
          <View className={styles.header} onClick={this.onClick}>
              <UserInfo
                name={user.nickname || ''}
                avatar={user.avatar || ''}
                location={position.location}
                view={`${viewCount}`}
                groupName={group?.groupName}
                time={createdAt}
                isEssence={isEssence}
                isPay={isPrice}
                isRed={isRedPack}
                isReward={isReward}
                userId={user?.userId}
                platform={platform}
              />
          </View>

          <ThreadCenterView data={data} onClick={this.onClick} onPay={this.onPay} platform={platform} />

          <BottomEvent
            userImgs={likeReward.users}
            wholeNum={likeReward.likePayCount || 0}
            comment={likeReward.postCount || 0}
            sharing={likeReward.shareCount || 0}
            onShare={this.onShare}
            onComment={this.onComment}
            onPraise={this.onPraise}
            isLiked={isLike}
            isSendingLike={this.state.isSendingLike}
            tipData={{ postId, threadId, platform, payType }}
            platform={platform}
          />
        </View>
      );
    }
}

// eslint-disable-next-line new-cap
export default Index;
