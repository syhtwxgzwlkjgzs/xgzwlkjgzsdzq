import { readLikedUsers } from '@server';

/**
 * 首页 - 点赞、打赏用户列表
 * @param {array} threadId *
 * @param {object} postId *
 * @param {object} type *
 * @param {object} isAll * 是否加载全部、点赞、打赏三页的数据
 * @returns {object} 处理结果
 */
export const getLikedUsers = async ({ threadId = '', postId = '', type = '', perPage = 10, page = 1 } = {}) => {
  // if (isAll) {
  //   const promise1 = readLikedUsers({ params: { threadId, postId, type: 0, page: 1, perPage } });
  //   const promise2 = readLikedUsers({ params: { threadId, postId, type: 1, page: 1, perPage } });
  //   const promise3 = readLikedUsers({ params: { threadId, postId, type: 2, page: 1, perPage } });
  //   const promise = [promise1, promise2, promise3];

  //   let res = await Promise.allSettled(promise);

  //   res = res.map((item) => {
  //     const { value } = item;
  //     const { code, data } = value;
  //     return code === 0 ? data : {};
  //   });

  //   return {
  //     res,
  //   };
  // }

  // const res = await readLikedUsers({ params: { threadId, postId, type, page, perPage } });

  // return {
  //   res,
  // };
  const res = await readLikedUsers({ params: { threadId, postId, type, page, perPage } });
  return res;
};
