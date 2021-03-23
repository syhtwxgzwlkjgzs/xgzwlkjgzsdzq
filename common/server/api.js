/**
 * 针对给出的请求实例进行本地化配置
 */
import { apiIns } from '@discuz/sdk/src/api';
import { handleError } from '@discuz/sdk/src/api/utils/handle-error';
import { ENV_CONFIG } from '@common/constants/site';

const { baseURL } = ENV_CONFIG;

const api = apiIns({
  baseURL,
  timeout: 1000,
});

const { http } = api;

// 请求拦截设置
// http.interceptors.request.use(config => config, error => error);

// 响应结果进行设置
http.interceptors.response.use((res) => {
  const { data } = res;
  return {
    code: data.Code,
    data: data.Data,
    msg: data.Message,
  };
}, error => handleError(error));

export default api;
