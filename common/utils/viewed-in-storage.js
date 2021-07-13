import Storage from '@common/utils/storage'

/**
 * sessionStorage中存储页面帖子被观看过的信息，用于记录分析浏览量等信息
 *
 * @param  {number}    threadId: 帖子的ID
 *
 */

const STORAGE_KEY = "__dzq_thread_viewed";
const storage = new Storage({ storageType: "session" });

const isViewed = function (threadId = null) {
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
const addViewed = function (threadId = null) {
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


export { isViewed, addViewed };
