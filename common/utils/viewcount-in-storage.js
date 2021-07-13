import Storage from '@common/utils/storage';
import { getViewCount } from '@server';

/**
 * sessionStorage中存储页面帖子被观看过的信息，用于记录分析浏览量等信息
 *
 * @param  {number}    threadId: 帖子的ID
 *
 */

const STORAGE_KEY = "__dzq_thread_viewed";
const storage = new Storage({ storageType: "session" });

const isViewed = (threadId = null) => {
  if(!threadId) return -1;
  threadId += ''; // 统一为字符串
  let viewedObj = JSON.parse(storage.get(STORAGE_KEY));
  if(!viewedObj) {
    viewedObj = { threads: [] };
    storage.set(STORAGE_KEY, JSON.stringify(viewedObj));
    return -1;
  }

  const viewedThreads = viewedObj.threads;
  for(let i = 0; viewedThreads && i < viewedThreads.length; i++) {
    const thread = viewedThreads[i];
    if(thread.id === threadId) {
      return i;
    }
  }
  return -1;
}

/**
 *
 * 看过的帖子，帖子信息会被增加到队列尾部，尾部的帖子总是最近浏览过的
 *
 * @param  {number}    threadId: 帖子的ID
 *
 * viewed在storage中结构
 * {
 *    viewed: {
 *      threads: [
 *        {
 *          id: threadId,
 *          viewedAt: new Date().getTime(); // time in millisecond
 *        }
 *      ];
 *    }
 * }
 */
const addViewed = (threadId = null) => {
  if(!threadId) return ;
  threadId += ''; // 统一为字符串

  const viewedIdx = isViewed(threadId);
  const viewedObj = JSON.parse(storage.get(STORAGE_KEY));
  const { threads } = viewedObj;

  if(!threads) return;

  if(viewedIdx >= 0) { // 删掉已看过的帖子
    threads.splice(viewedIdx, 1);
  }
  threads.push({ // 看过的帖子信息放在队列尾部
    id: threadId,
    viewedAt: new Date().getTime(),
  });
  viewedObj.threads = [...threads];
  storage.set(STORAGE_KEY, JSON.stringify(viewedObj));
}


const updateViewCountInStores = async (threadId = null, stores = []) => {
  if(!threadId || !stores || !stores.length) return ;
  threadId += ''; // 统一为字符串

  try {
    let newViewCount = -1;

    if(isViewed(threadId) === -1) { // storage中没找到帖子
      // 更新后台数据
      const res = await getViewCount({ params: { threadId } });
      if(res.code === 0) {
        newViewCount = res.data.viewCount;
      } else {
        console.error(res?.msg);
      }
    }
    // 更新storage中浏览数据
    addViewed(threadId);

    for(const store of stores) {
      if(!store || typeof store !== 'object') continue;
      if(newViewCount !== -1) {
        console.log(`store`, store)
        console.log(`newViewCount`, newViewCount)
        store.updateAssignThreadInfo(parseInt(threadId), { updateType: 'viewCount', updatedInfo: { viewCount: newViewCount } })
      }
    }

  } catch (error) {
    console.error(error);
  }

}


export { isViewed, addViewed, updateViewCountInStores };
