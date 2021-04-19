/**
 * 针对给出的请求实例进行本地化配置
 */
import { apiIns } from '@discuzq/sdk/dist/api';
import typeofFn from '@common/utils/typeof';
import setAuthorization from '@common/utils/set-authorization';
import setUserAgent from '@common/utils/set-user-agent';
import { ENV_CONFIG } from '@common/constants/site';

const api = apiIns({
  baseURL: ENV_CONFIG.COMMOM_BASE_URL,
  timeout: 1000,
});

const { http } = api;

// 处理数据异常，当数据为空对象或空数组，都将统一返回null
function reasetData(data) {
  if (!data) return null;
  if (typeofFn.isArray(data)) {
    if (data.length === 0) {
      return null;
    }
    return data;
  }
  return typeofFn.isEmptyObject(data) ? null : data;
}

// 请求拦截
http.interceptors.request.use(
  // 设置userAgent
  // 设置请求头
  (config) => {
    // eslint-disable-next-line no-param-reassign
    config = setUserAgent(config);
    return setAuthorization(config);
  },
  (error) => {
    // 对请求错误做些什么
    console.error('request', error);
    return {
      code: -1,
      data: null,
      msg: '',
    };
  },
);

// 响应结果进行设置
http.interceptors.response.use((res) => {
  const { data } = res;
  return {
    code: data.Code,
    data: reasetData(data.Data),
    msg: data.Message,
  };
}, (err) => {
  console.error('response', err.stack);
  console.error('response', err.message);
  return {
    code: -1,
    data: null,
    msg: '',
  };
});

export default api;
