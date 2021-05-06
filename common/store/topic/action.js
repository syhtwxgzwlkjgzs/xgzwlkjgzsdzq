import { action } from 'mobx';
import TopicStore from './store';
import { readTopicsList } from '../../server';
import typeofFn from '@common/utils/typeof';

class TopicAction extends TopicStore {
  constructor(props) {
    super(props);
  }

  @action
  setTopics(data) {
    this.topics = data;
  }

  @action
  setTopicDetail(data) {
    this.topicDetail = data;
  }

  /**
 * 话题 - 列表
 * @param {object} search * 搜索值
 * @returns {object} 处理结果
 */
  @action
  async getTopicsList({ search = '', sortBy = '1', perPage = 10, page = 1 } = {}) {
    const topicFilter = {
      sortBy,
      content: search,
      hot: 0
    };
    const result = await readTopicsList({ params: { filter: topicFilter, perPage, page } });

    if (result.code === 0 && result.data) {
      if (this.topics && result.data.pageData && page !== 1) {
        this.topics.pageData.push(...result.data.pageData);
        const newPageData = this.topics.pageData.slice();
        this.setTopics({ ...result.data, pageData: newPageData });
      } else {
        // 首次加载，先置空，是为了列表回到顶部
        this.setTopics({ pageData: [] });
        this.setTopics(result.data);
      }
      return result.data;
    }
    return null;
  };

  /**
 * 话题 - 列表
 * @param {object} search * 搜索值
 * @returns {object} 处理结果
 */
  @action
  async getTopicsDetail({ topicId = '' } = {}) {
    const topicFilter = {
      topicId,
      hot: 0
    };
    const result = await readTopicsList({ params: { filter: topicFilter } });

    if (result.code === 0 && result.data) {
      return this.setTopicDetail(result.data);
    }
    return null;
  };

    // 获取指定的帖子数据
  findAssignThread(threadId) {
    if (this.topicDetail) {
      let obj = null
      const { pageData = [] } = this.topicDetail;
      for (let i = 0; i < pageData.length; i++)  {
        pageData[i].threads?.forEach((item, j) => {
          if (item.threadId === threadId) {
            obj = { index: i, subIndex: j, data: item };
          }
        })
      }
      return obj;
    }
  }

  /**
   * 支付成功后，更新帖子列表指定帖子状态
   * @param {number} threadId 帖子id
   * @param {object}  obj 更新数据
   * @returns
   */
   @action
   updatePayThreadInfo(threadId, obj) {
     const targetThread = this.findAssignThread(threadId);
     
     if (!targetThread) return;

     const { index, subIndex } = targetThread;
     if (this.topicDetail?.pageData) {
       this.topicDetail.pageData[index].threads[subIndex] = obj;
     }
   }
 
   /**
    * 更新帖子列表指定帖子状态
    * @param {number} threadId 帖子id
    * @param {object}  obj 更新数据
    * @param {boolean} obj.isLike 是否更新点赞
    * @param {boolean} obj.isPost 是否更新评论数
    * @param {boolean} obj.user 当前操作的用户
    * @returns
    */
   @action
   updateAssignThreadInfo(threadId, obj = {}) {
     const targetThread = this.findAssignThread(threadId);

     if (!targetThread) return;
     const { index, subIndex, data } = targetThread;
 
     // 更新点赞
     const { isLike, isPost, isShare, user } = obj;
     if (!typeofFn.isUndefined(isLike) && !typeofFn.isNull(isLike)) {
       data.isLike = isLike;
 
       if (isLike) {
         data.likeReward.users = data.likeReward?.users?.length ? [user] : [...data.likeReward?.users, user]
         data.likeReward.likePayCount = data.likeReward.likePayCount + 1
       } else {
         data.likeReward.users = data.likeReward.users.filter(item => item.userId === user.userId)
         data.likeReward.likePayCount = data.likeReward.likePayCount - 1
       }
     }
 
     // 更新评论
     if (!typeofFn.isUndefined(isPost) && !typeofFn.isNull(isPost)) {
       data.likeReward.postCount = isPost ? data.likeReward.postCount + 1 : data.likeReward.postCount - 1;
     }
 
     // 更新分享
     if (!typeofFn.isUndefined(isShare) && !typeofFn.isNull(isShare)) {
       data.likeReward.shareCount = isShare ? data.likeReward.shareCount + 1 : data.likeReward.shareCount - 1;
     }

     if (this.topicDetail?.pageData) {
        this.topicDetail.pageData[index].threads[subIndex] = data;
      }
   }
}

export default TopicAction;
