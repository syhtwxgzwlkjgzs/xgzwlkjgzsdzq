// import { updateViewCount } from '@discuzq/sdk/dist/api/home/update-view-count';

/** 观看数量更新
 * @param {object} params
 * @returns object
 */
export default async function _updateViewCount(opts, ctx = null) {
  // const res = await updateViewCount({ ...opts, __context: ctx, isValidate: false });
  // return res;

  return {
    Code: 0,
    Data: [],
    Message: "Success"
  };
}
