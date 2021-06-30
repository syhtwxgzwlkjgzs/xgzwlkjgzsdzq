import React from 'react';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { readThreadDetail, readCommentList } from '@server';
import ThreadH5Page from '@layout/thread/h5';
import ThreadPCPage from '@layout/thread/pc';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import Router from '@discuzq/sdk/dist/router';
import ErrorPCPage from '@layout/error/pc';
import ErrorH5Page from '@layout/error/h5';
import ViewAdapter from '@components/view-adapter';
import { Toast } from '@discuzq/design';
import setWxShare from '@common/utils/set-wx-share';
import htmlToString from '@common/utils/html-to-string';

@inject('site')
@inject('thread')
@inject('user')
@observer
class Detail extends React.Component {
  static async getInitialProps(ctx) {
    const id = ctx?.query?.id;
    const serverThread = {
      threadData: null,
      commentList: null,
      totalCount: 0,
      authorInfo: null,
    };

    if (id) {
      // 获取帖子详情
      const res = await readThreadDetail({ params: { threadId: Number(id) } });
      if (res.code === 0) {
        serverThread.threadData = res.data;
      }

      // 获取评论列表
      const commentRes = await readCommentList({
        params: {
          filter: {
            thread: Number(id),
          },
          sort: 'createdAt',
          page: 1,
          perPage: 20,
        },
      });

      if (commentRes.code === 0) {
        serverThread.commentList = commentRes.data?.pageData || [];
        serverThread.totalCount = commentRes.data?.totalCount || 0;
      }
    }

    return {
      serverThread,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      isServerError: false,
      serverErrorMsg: '',
    };

    const { thread, serverThread } = this.props;

    // 初始化数据到store中
    serverThread?.threadData && thread.setThreadData(serverThread.threadData);
    serverThread?.commentList && thread.setCommentList(serverThread.commentList);
    serverThread?.totalCount && thread.setTotalCount(serverThread.totalCount);
  }

  componentDidUpdate(prevProps) {
    if (this.props.router?.query?.id && this.props.router.query.id !== prevProps.router.query.id) {
      this.props.thread.reset();
      this.getPageDate(this.props.router.query.id);
    }
    if ( this.props.thread && this.props.thread.threadData ) {
      this.handleWeiXinShare();
    }
  }

  async componentDidMount() {
    const { id } = this.props.router.query;

    if (id) {
      this.getPageDate(id);
    }

    if ( this.props.thread && this.props.thread.threadData ) {
      this.handleWeiXinShare();
    }
  }

  handleWeiXinShare = async () => {
    try {
      const { site, thread, user } = this.props;
      const {webConfig} = site;
      const {setSite} = webConfig;
      const {siteFavicon} = setSite;
      const { threadData } = thread;
      const { content, title } = threadData;
      const { text, indexes } = content;

      function setSpecialTitle(user, indexes = []) {
        const arr = [];
        if ( indexes['101'] ) arr.push('图片');
        if ( indexes['103'] ) arr.push('视频');
        if ( indexes['102'] ) arr.push('音频');
        if ( indexes['108'] ) arr.push('附件');
        const contentLable = arr.length > 0 ? `【${arr.join('/')}】` : '【无内容】';
        const name = user.userInfo && user.userInfo.nickname ? `【${user.userInfo.nickname}】` : '';
        return `${name}分享${contentLable}`;
      }

      function setShareImg(user, text, indexes = [], favicon) {
        let img = null;

        // 取图文混排图片
        const imageList = text.match(/<img[\s]+[^<>]*>|<img[\s]+[^<>]*/g);
        for ( let i = 0; i < imageList.length; i++ ) {
          if ( imageList[i].indexOf('qq-emotion') === -1) {
            img = imageList[i].match(/(http|https):\/\/.*?(webp|png|jpg|jpeg)/gi);
            if (img) {
              img = img ? img[0] : null;
              break;
            } 
          }
        }

        // 取上传图片
        if (!img && indexes['101']) {
          const bodyImgs = indexes['101'].body || [];
          for ( let i = 0; i < bodyImgs.length; i++ ) {
            if (bodyImgs[i].extension !== 'gif') {
              img = bodyImgs[i].thumbUrl;
              break;
            }
          }
        }
        // 取用户头像
        if (!img && user && user.userInfo && user.userInfo.avatarUrl) {
          img = user.userInfo.avatarUrl;
        }

        if (!img && favicon && favicon !== '') {
          img = favicon;
        }

        return img;
      }

      let desc = htmlToString(text);
      desc = desc && desc !== '' ? desc.slice(0, 28) : ''
      let shareTitle = title && title !== '' ? title : desc && desc !== '' ? desc : setSpecialTitle(user, indexes);
      const shareImg = setShareImg(user, text, indexes, siteFavicon);
      setWxShare(shareTitle, desc, window.location.origin, shareImg);
    } catch(err) {
      console.error('设置分享错误', err);
    }
    
  };

  async getPageDate(id) {
    // 获取帖子数据
    if (!this.props?.thread?.threadData || !this.hasMaybeCache()) {
      // TODO:这里可以做精细化重置
      const isPositionToComment = this.props.thread?.isPositionToComment || false;
      this.props.thread.reset({ isPositionToComment });

      const res = await this.props.thread.fetchThreadDetail(id);
      if (res.code !== 0) {
        // 404
        if (res.code === -4004) {
          Router.replace({ url: '/404' });
          return;
        }

        if (res.code > -5000 && res.code < -4000) {
          this.setState({
            serverErrorMsg: res.msg,
          });
        }

        this.setState({
          isServerError: true,
        });
        return;
      }

      // 判断是否审核通过
      const isApproved = (this.props.thread?.threadData?.isApproved || 0) === 1;
      if (!isApproved) {
        const currentUserId = this.props.user?.userInfo?.id; // 当前登录用户
        const userId = this.props.thread?.threadData?.user?.userId; // 帖子作者
        // 不是作者自己。跳回首页
        if (!currentUserId || !userId || currentUserId !== userId) {
          Toast.info({ content: '内容正在审核中，审核通过后才能正常显示!' });
          Router.redirect({ url: '/' });
          return;
        }
      }
    }

    // 获取评论列表
    if (!this.props?.thread?.commentList || !this.hasMaybeCache()) {
      const params = {
        id,
      };
      this.props.thread.loadCommentList(params);
    }

    // 获取作者信息
    if (!this.props?.thread?.authorInfo || !this.hasMaybeCache()) {
      const { site } = this.props;
      const { platform } = site;
      const userId = this.props.thread?.threadData?.user?.userId;
      if (platform === 'pc' && userId) {
        this.props.thread.fetchAuthorInfo(userId);
      }
    }
  }

  // 判断是否可能存在缓存
  hasMaybeCache() {
    const { id } = this.props.router.query;
    const oldId = this.props?.thread?.threadData?.threadId;

    return id && oldId && Number(id) === oldId;
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (this.state.isServerError) {
      return platform === 'h5' ? (
        <ErrorH5Page text={this.state.serverErrorMsg} />
      ) : (
        <ErrorPCPage text={this.state.serverErrorMsg} />
      );
    }

    return <ViewAdapter h5={<ThreadH5Page />} pc={<ThreadPCPage />} title={this.props?.thread?.title || ''} />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(Detail));
