/**
 * sessionStorage中存储页面帖子被观看过的信息，用于记录分析浏览量等信息
 *
 * @param  {number}    threadId: 帖子的ID
 *
 */
const isViewed = function (threadId = null) {
  if(!threadId) return false;
  threadId += ''; // 统一为字符串
  const viewedThreads = sessionStorage.getItem("viewed"); // TODO: 用sessionStorage
  for(const thread of viewedThreads) {
    if(thread.id === threadId) return true;
  }
  return false;
}

/**
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
  if(!threadId) return ; // TODO: threadId可能是number或string
  threadId += ''; // 统一为字符串
  if(isViewed(threadId)) return;
  const viewedThreads = sessionStorage.getItem("viewed");
  viewedThreads.push({
    id: threadId,
    viewedAt: new Date().getTime(),
  });
  sessionStorage.setItem("viewed", { threads: viewedThreads });
}


export { isViewed, addViewed };
