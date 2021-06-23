// TODO: 待 sdk 更新，进行替换

import api from '../api';

export default async function readPostCategories(opt = {}) {
  try {
    const { params = {}, data = {}, ...others } = opt;
    const options = {
      url: '/apiv3/categories.thread', // 请求地址
      method: 'GET',
      params,
      data,
      ...others,
    };
    const result = await api.http(options);
    return result;
  } catch (error) {
    return error;
  }
};
