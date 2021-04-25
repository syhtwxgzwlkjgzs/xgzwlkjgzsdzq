import React, { Component, Fragment } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { observer, inject } from 'mobx-react';

import ThemePage from '@components/theme-page';
import { Icon, Input, Badge, Toast, Button } from '@discuzq/design';

import layout from './layout.module.scss';
import footer from './footer.module.scss';
import comment from './comment.module.scss';
import topic from './topic.module.scss';

import CommentList from './components/comment-list/index';
import LoadingTips from './components/loading-tips/index';
import InputPopup  from './components/input-popup/index';
import DeletePopup from './components/delete-popup';

import throttle from '@common/utils/thottle';


// 帖子内容
const RenderThreadContent = observer((props) => {
  const { store: threadStore } = props;
  const { text, indexes } = threadStore?.threadData?.content || {};
  const isEssence = threadStore?.threadData?.displayTag?.isEssence || false;

  const parseContent = {};
  if (indexes && Object.keys(indexes)) {
    Object.entries(indexes).forEach(([, value]) => {
      if (value) {
        const { tomId, body } = value;
        parseContent[typeMap[tomId]] = body;
      }
    });
  }

  const onMoreClick = () => {
    props.fun.moreClick();
  };

  const onLikeClick = () => {
    typeof props.onLikeClick === 'function' && props.onLikeClick();
  };

  const onBuyClick = (url) => {
    url && window.open(url);
  };

  return (
    <View className={`${layout.top} ${topic.container}`}>
      这是帖子的内容哈
    </View>
  );
});

// 评论列表
@inject('thread')
@inject('comment')
@observer
class RenderCommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentInput: false, // 是否弹出评论框
      commentSort: true, // ture 评论从旧到新 false 评论从新到旧
      showDeletePopup: false, // 是否弹出删除弹框
      inputText: '请输入内容', // 默认回复框placeholder内容
    };

    this.commentData = null;
    this.replyData = null;
  }

  componentDidMount() {
    console.log('componentDidMount', this.props.thread);
  }

  // 评论列表排序
  onSortClick = () => {
    this.setState({
      commentSort: !this.state.commentSort,
    });
    typeof this.props.sort === 'function' && this.props.sort(!this.state.commentSort);
  };

  // 点击评论的赞
  async likeClick(data) {
    console.log('哈哈哈啊哈');
    Toast.success({
      content: '这是赞啊',
    });
    if (!data.id) return;

    const params = {
      id: data.id,
      isLiked: !data.isLiked,
    };
    const { success, msg } = await this.props.comment.updateLiked(params, this.props.thread);
    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 点击回复的赞
  async replyLikeClick(reply) {
    if (!reply.id) return;

    const params = {
      id: reply.id,
      isLiked: !reply.isLiked,
    };
    const { success, msg } = await this.props.comment.updateLiked(params, this.props.thread);
    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  // 点击评论的删除
  async deleteClick(data) {
    this.commentData = data;
    this.setState({
      showDeletePopup: true,
    });
  }

  // 删除评论
  async deleteComment() {
    if (!this.commentData.id) return;

    const { success, msg } = await this.props.comment.delete(this.commentData.id, this.props.thread);
    this.setState({
      showDeletePopup: false,
    });
    if (success) {
      Toast.success({
        content: '删除成功',
      });
      return;
    }
    Toast.error({
      content: msg,
    });
  }

  // 点击评论的回复
  replyClick(comment) {
    this.commentData = comment;
    this.replyData = null;
    const userName = comment?.user?.username || comment?.user?.userName;
    this.setState({
      showCommentInput: true,
      inputText: userName ? `回复${userName}` : '请输入内容',
    });
  }

  // 点击回复的回复
  replyReplyClick(reply, comment) {
    this.commentData = null;
    this.replyData = reply;
    this.replyData.commentId = comment.id;
    const userName = reply?.user?.username || reply?.user?.userName;

    this.setState({
      showCommentInput: true,
      inputText: userName ? `回复${userName}` : '请输入内容',
    });
  }

  // 创建回复评论+回复回复接口
  async createReply(val) {
    const id = this.props.thread?.threadData?.id;
    if (!id) return;

    const params = {
      id,
      content: val,
    };

    // 楼中楼回复
    if (this.replyData) {
      params.replyId = this.replyData.id;
      params.isComment = true;
      params.commentId = this.replyData.commentId;
      params.commentPostId = this.replyData.id;
    }
    // 回复评论
    if (this.commentData) {
      params.replyId = this.commentData.id;
      params.isComment = true;
      params.commentId = this.commentData.id;
    }

    const { success, msg } = await this.props.comment.createReply(params, this.props.thread);

    if (success) {
      this.setState({
        showCommentInput: false,
        inputValue: '',
      });
      Toast.success({
        content: '回复成功',
      });
      return true;
    }

    Toast.error({
      content: msg,
    });
  }

  // 点击编辑
  editClick(comment) {
    typeof this.props.onEditClick === 'function' && this.props.onEditClick(comment);
  }

  onCommentClick = (data) => {
    console.log('能触发啊', data, this.props);
    if (data.id && this.props.thread?.threadData?.id) {
      Taro.navigateTo({
        url: `pages/commentDetail/index/${data.id}?threadId=${this.props.thread?.threadData?.id}`,
      });
    }
    Taro.navigateTo({
      url: `commentDetail/index`,
    });
  }

  render() {
    const { totalCount, commentList } = this.props.thread;
    console.log('this.props.thread', this.props.thread);

    return (
      <Fragment>
        <View className={comment.header}>
          <View className={comment.number}>共{totalCount}条评论</View>
          <View className={comment.sort} onClick={() => this.onSortClick()}>
            <Icon className={comment.sortIcon} name="SortOutlined"></Icon>
            <Text className={comment.sortText}>
              {this.state.commentSort ? '评论从旧到新' : '评论从新到旧'}
            </Text>
          </View>
        </View>
        <View className={comment.body}>
          {commentList.map((val, index) => (
          // {this.state.commentData.map((val, index) => (
            <View className={comment.commentItems} key={val.id || index}>
              <CommentList
                data={val}
                key={val.id}
                likeClick={() => this.likeClick(val)}
                replyClick={() => this.replyClick(val)}
                deleteClick={() => this.deleteClick(val)}
                editClick={() => this.editClick(val)}
                replyLikeClick={reploy => this.replyLikeClick(reploy, val)}
                replyReplyClick={reploy => this.replyReplyClick(reploy, val)}
                onCommentClick={() => this.onCommentClick(val)}
                isShowOne
              ></CommentList>
            </View>
          ))}
        </View>

        {/* 评论弹层 */}
        {/* <InputPopup
          visible={this.state.showCommentInput}
          inputText={this.state.inputText}
          onClose={() => this.setState({ showCommentInput: false })}
          onSubmit={value => this.createReply(value)}
        ></InputPopup> */}

        {/* 删除弹层 */}
        {/* <DeletePopup
          visible={this.state.showDeletePopup}
          onClose={() => this.setState({ showDeletePopup: false })}
          onBtnClick={() => this.deleteComment()}
        ></DeletePopup> */}
      </Fragment>
    );
  }
}


@inject('site')
@inject('user')
@inject('thread')
@inject('comment')
@inject('index')
@observer
class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeletePopup: false, // 是否弹出删除弹框
      showCommentInput: false, // 是否弹出评论框
      showMorePopup: false, // 是否弹出更多框
      isCommentLoading: false, // 列表loading
      setTop: false, // 置顶
      showContent: '',
      inputValue: '', // 评论内容
    };

    this.perPage = 5;
    this.page = 1; // 页码
    this.commentDataSort = false;

    // 滚动定位相关属性
    this.threadBodyRef = React.createRef();
    this.commentDataRef = React.createRef();
    this.position = 0;
    this.nextPosition = 0;
    this.flag = true;

    // 修改评论数据
    this.comment = null;
  }

  // 滚动事件
  handleOnScroll = () => {
    console.log('滚滚滚谷歌你');
    // 加载评论列表
    const scrollDistance = this.threadBodyRef?.current?.scrollTop;
    const offsetHeight = this.threadBodyRef?.current?.offsetHeight;
    const scrollHeight = this.threadBodyRef?.current?.scrollHeight;
    const { isCommentReady, isNoMore } = this.props.thread;
    if (scrollDistance + offsetHeight >= scrollHeight && !this.state.isCommentLoading && isCommentReady && !isNoMore) {
      this.page = this.page + 1;
      this.loadCommentList();
    }

    if (this.flag) {
      this.nextPosition = this.threadBodyRef?.current?.scrollTop || 0;
    }
  }

  componentDidMount() {
    // 当内容加载完成后，获取评论区所在的位置
    this.position = this.commentDataRef?.current?.offsetTop - 50;
    // console.log('componentDidMount', this.props);
    this.loadCommentList();
  }

  componentDidUpdate() {
    // 当内容加载完成后，获取评论区所在的位置
    if (this.props.thread.isReady) {
      this.position = this.commentDataRef?.current?.offsetTop - 50;
    }
  }

  componentWillUnmount() {
    // 清空数据
    // this.props?.thread && this.props.thread.reset();
  }

  // 点击信息icon
  onMessageClick = () => {
    console.log('this.threadBodyRef', this.threadBodyRef)
    const position = this.flag ? this.position : this.nextPosition;
    this.flag = !this.flag;
    this.threadBodyRef.current.scrollTo(0, position);
  }

  // 点击收藏icon
  async onCollectionClick() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isFavorite: !this.props.thread?.isFavorite,
    };
    const { success, msg } = await this.props.thread.updateFavorite(params);

    if (success) {
      Toast.success({
        content: '操作成功',
      });
      return;
    }

    Toast.error({
      content: msg,
    });
  }

  // 加载评论列表
  async loadCommentList() {
    const { isCommentReady } = this.props.thread;
    if (this.state.isCommentLoading || !isCommentReady) {
      return;
    }

    this.setState({
      isCommentLoading: true,
    });
    const id = this.props.thread?.threadData?.id;
    const params = {
      id: 123,
      page: this.page,
      perPage: this.perPage,
      sort: this.commentDataSort ? '-createdAt' : 'createdAt',
    };

    const { success, msg } = await this.props.thread.loadCommentList(params);
    this.setState({
      isCommentLoading: false,
    });
    if (success) {
      return;
    }
    Toast.error({
      content: msg,
    });
  }

  // 列表排序
  onSortChange(isCreateAt) {
    this.commentDataSort = isCreateAt;
    this.page = 1;
    this.loadCommentList();
  }

  // 点击评论
  onInputClick() {
    this.setState({
      showCommentInput: true,
    });
  }

  // 点击更多icon
  onMoreClick = () => {
    console.log('更多');
    // this.setState({
    //   text: !this.state.text,
    // });
    this.setState({ showMorePopup: true });
  };

  // 1 置顶  2 加精  3 删除  4 举报
  onOperClick = (type) => {
    this.setState({ showMorePopup: false });

    // 举报
    if (type === 'stick') {
      this.updateStick();
    }

    // 加精
    if (type === 'essence') {
      this.updateEssence();
    }

    // 删除
    if (type === 'delete') {
      this.setState({ showDeletePopup: true });
    }
  };

  // 置顶提示
  setTopState(isStick) {
    this.setState({
      showContent: isStick,
      setTop: !this.state.setTop,
    });
    setTimeout(() => {
      this.setState({ setTop: !this.state.setTop });
    }, 2000);
  }

  // 置顶接口
  async updateStick() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isStick: !this.props.thread?.threadData?.isStick,
    };
    const { success, msg } = await this.props.thread.updateStick(params);

    if (success) {
      this.setTopState(true);
      return;
    }

    Toast.error({
      content: msg,
    });
  }

  // 加精接口
  async updateEssence() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      isEssence: !this.props.thread?.threadData?.displayTag?.isEssence,
    };
    const { success, msg } = await this.props.thread.updateEssence(params);

    if (success) {
      Toast.success({
        content: '操作成功',
      });
      return;
    }

    Toast.error({
      content: msg,
    });
  }

  // 帖子删除接口
  async delete() {
    this.setState({ showDeletePopup: false });
    const id = this.props.thread?.threadData?.id;

    const { success, msg } = await this.props.thread.delete(id, this.props.index);

    if (success) {
      Toast.success({
        content: '删除成功，即将跳转至首页',
      });

      setTimeout(() => {
        this.props.router.push('/');
      }, 1000);

      return;
    }

    Toast.error({
      content: msg,
    });
  }

  onBtnClick() {
    this.delete();
    this.setState({ showDeletePopup: false });
  }

  // 点击发布按钮
  onPublishClick(val) {
    this.comment ? this.updateComment(val) : this.createComment(val);
  }

  // 创建评论
  async createComment(val) {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      content: val,
      sort: this.commentDataSort, // 目前的排序
      isNoMore: false,
      attachments: [],
    };
    const { success, msg } = await this.props.comment.createComment(params, this.props.thread);
    if (success) {
      Toast.success({
        content: '评论成功',
      });
      this.setState({
        showCommentInput: false,
        inputValue: '',
      });
      return true;
    }
    Toast.error({
      content: msg,
    });
  }

  // 更新评论
  async updateComment(val) {
    if (!this.comment) return;

    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      pid: this.comment.id,
      content: val,
      attachments: [],
    };
    const { success, msg } = await this.props.comment.updateComment(params, this.props.thread);
    if (success) {
      Toast.success({
        content: '修改成功',
      });
      this.setState({
        showCommentInput: false,
        inputValue: '',
      });
      return true;
    }
    Toast.error({
      content: msg,
    });
  }

  // 点击编辑评论
  onEditClick(comment) {
    this.comment = comment;
    this.setState({
      inputValue: comment.content,
      showCommentInput: true,
    });
  }

  // 弹出框关闭
  onClose() {
    this.setState({
      showCommentInput: false,
    });
    this.comment = null;
  }

  // 点赞
  async onLikeClick() {
    const id = this.props.thread?.threadData?.id;
    const params = {
      id,
      pid: this.props.thread?.threadData?.postId,
      isLiked: !this.props.thread?.threadData?.isLike,
    };
    const { success, msg } = await this.props.thread.updateLiked(params, this.props.index);

    if (!success) {
      Toast.error({
        content: msg,
      });
    }
  }

  render() {
    const { thread: threadStore } = this.props;
    const { isReady, isCommentReady, isNoMore, totalCount } = threadStore;

    return (
      <ThemePage>
      <View className={layout.container}>
        <View className={layout.header}>header</View>
        <View
          className={layout.body}
          ref={this.threadBodyRef}
          onScroll={() => throttle(this.handleOnScroll(), 500)}
          >
           {/* 帖子内容 */}
           {isReady ? (
            <RenderThreadContent
              store={threadStore}
              // fun={fun}
              onLikeClick={() => this.onLikeClick()}
            ></RenderThreadContent>
          ) : (
            <LoadingTips type="init"></LoadingTips>
          )}
          <View className={`${layout.bottom} ${comment.container}`} ref={this.commentDataRef}>
             {isCommentReady ? (
              <Fragment>
                <RenderCommentList
                  router={this.props.router}
                  sort={flag => this.onSortChange(flag)}
                  onEditClick={comment => this.onEditClick(comment)}>
                </RenderCommentList>
                {this.state.isCommentLoading && <LoadingTips></LoadingTips>}
                {isNoMore && <NoMore empty={totalCount === 0}></NoMore>}
              </Fragment>
            ) : (
              <LoadingTips type="init"></LoadingTips>
            )}
          </View>
        </View>

        {/* 底部操作栏 */}
        <View className={layout.footer}>
          {/* 评论区触发 */}
          <View className={footer.inputClick} onClick={this.onInputClick}>
            <Icon size="16" name="EditOutlined" className={footer.inputIcon}></Icon>
            <View className={footer.input}>写评论</View>
          </View>
          {/* 操作区 */}
          <View className={footer.operate}>
            <View className={footer.icon} onClick={this.onMessageClick}>
             <Icon size="20" name="MessageOutlined"></Icon>
            </View>
            {/* <Badge info={99}>
              <Icon size="20" name="MessageOutlined"></Icon>
            </Badge> */}
            <Icon
              color={this.props.thread?.isFavorite ? 'blue' : ''}
              className={footer.icon}
              size="20"
              name="CollectOutlined"
            ></Icon>
            <Icon className={footer.icon} size="20" name="ShareAltOutlined"></Icon>
          </View>
        </View>
        {/* 评论弹层 */}
        {/* <InputPopup
          visible={this.state.showCommentInput}
          onClose={() => this.onClose()}
          initValue={this.state.inputValue}
          onSubmit={value => this.onPublishClick(value)}
        /> */}
      </View>
      </ThemePage>
    );
  }
}

export default Index;
