import React from 'react';
import { withRouter } from 'next/router';
import { Icon, Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import BottomEvent from './bottom-event';
import UserInfo from './user-info';
import NoData from '../no-data';
import styles from './index.module.scss';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import goToLoginPage from '@common/utils/go-to-login-page';
import threadPay from '@common/pay-bussiness/thread-pay';
import ThreadCenterView from './ThreadCenterView';
import { throttle } from '@common/utils/throttle-debounce';
import { debounce } from './utils';
import { noop } from '@components/thread/utils';

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
      Toast.info({ content: '复制链接成功' });
      this.handleShare();
    }
    handleShare = debounce(() => {
      // 对没有登录的先登录
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/user/login' });
        return;
      }

      const { title = '', threadId = '', user } = this.props.data || {};

      h5Share({path: `thread/${threadId}`});
      this.props.index.updateThreadShare({ threadId }).then(result => {
        if (result.code === 0) {
          this.props.index.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.search.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.user.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });

          const { recomputeRowHeights = noop } = this.props;
          recomputeRowHeights();
        }
      });
    }, 500)

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
        this.props.thread.positionToComment();
        this.props.router.push(`/thread/${threadId}`);
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
        goToLoginPage({ url: '/user/login' });
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

          const { recomputeRowHeights = noop } = this.props;
          recomputeRowHeights();
        }
        this.setState({isSendingLike: false});
      });
    }, 1000)

    // 支付
    onPay = (e) => {
      e && e.stopPropagation();
      this.handlePay()
    }
    handlePay = debounce(async () => {
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
          this.props.user.updatePayThreadInfo(thread?.threadId, data)

          const { recomputeRowHeights = noop } = this.props;
          recomputeRowHeights(data);
        }
      }
    }, 1000)

    onClickUser = (e) => {
      e && e.stopPropagation()

      const { user = {}, isAnonymous } = this.props.data || {};
      if (!!isAnonymous) {
        this.onClick()
      } else {
        this.props.router.push(`/user/${user?.userId}`);
      }
    }

    onClick = throttle(() => {

      const { threadId = '', ability } = this.props.data || {};
      const { canViewPost } = ability;

      if (!canViewPost) {
        Toast.info({ content: '暂无权限查看详情，请联系管理员' });
        return;
      }

      if (threadId !== '') {
        this.props.router.push(`/thread/${threadId}`);

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
    }, 1000);

    onClickHeaderIcon = (e) => {
      e && e.stopPropagation();

      const { onClickIcon = noop } = this.props;
      onClickIcon(e)
    }

    onOpen = () => {
      const { threadId = '' } = this.props.data || {};

      this.props.index.updateAssignThreadInfo(threadId, { updateType: 'openedMore', openedMore: true });
    }

    render() {
      const { data, className = '', site = {}, showBottomStyle = true ,  collect = '', unifyOnClick = null, isShowIcon = false } = this.props;
      const { platform = 'pc' } = site;

      const { onContentHeightChange = noop, onImageReady = noop, onVideoReady = noop } = this.props;

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
        isAnonymous,
      } = data || {};
      const { isEssence, isPrice, isRedPack, isReward } = displayTag || {};

      return (
        <div className={`${styles.container} ${className} ${showBottomStyle && styles.containerBottom} ${platform === 'pc' && styles.containerPC}`}>
          <div className={styles.header} onClick={unifyOnClick || this.onClick}>
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
                isAnonymous={isAnonymous}
                userId={user?.userId}
                platform={platform}
                collect={collect}
                onClick={unifyOnClick || this.onClickUser}
                unifyOnClick={unifyOnClick}
              />
              {isShowIcon && <div className={styles.headerIcon} onClick={unifyOnClick || this.onClickHeaderIcon}>？？？？<Icon name='CollectOutlinedBig' size={20}></Icon></div>}
          </div>

          <ThreadCenterView
            onContentHeightChange={onContentHeightChange}
            onImageReady={onImageReady}
            onVideoReady={onVideoReady}
            data={data}
            onClick={unifyOnClick || this.onClick}
            onPay={unifyOnClick || this.onPay}
            platform={platform}
            onOpen={this.onOpen}
          />

          <BottomEvent
            userImgs={likeReward.users}
            wholeNum={likeReward.likePayCount || 0}
            comment={likeReward.postCount || 0}
            sharing={likeReward.shareCount || 0}
            onShare={unifyOnClick || this.onShare}
            onComment={unifyOnClick || this.onComment}
            onPraise={unifyOnClick || this.onPraise}
            isLiked={isLike}
            isSendingLike={this.state.isSendingLike}
            tipData={{ postId, threadId, platform, payType }}
            platform={platform}
          />
        </div>
      );
    }
}

// eslint-disable-next-line new-cap
export default withRouter(Index);
