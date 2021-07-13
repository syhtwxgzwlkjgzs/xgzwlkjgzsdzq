/**
 * localStorage中存储页面帖子被观看过的信息，用于记录分析浏览量等信息
 *
 * @param  {number}    threadId: 帖子的ID
 *
 */
const isViewed = function (threadId = null) {
  if(!threadId) return false;
  const viewedThreads = localStorage.getItem("viewed");
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
  if(!threadId) return ;
  const viewedThreads = localStorage.getItem("viewed");
  viewedThreads.push({
    id: threadId,
    viewedAt: new Date().getTime(),
  });
  localStorage.setItem("viewed", { threads: viewedThreads });
}


export { isViewed, addViewed };
