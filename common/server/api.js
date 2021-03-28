/**
 * 针对给出的请求实例进行本地化配置
 */
import { apiIns } from '@discuz/sdk/src/api';
import typeofFn from '@common/utils/typeof';
import setAuthorization from '@common/utils/set-authorization';
const api = apiIns({
  baseURL: 'https://newdiscuz-dev.dnspod.dev',
  timeout: 1000,
});

const { http } = api;

// 处理数据异常，当数据为空对象或空数组，都将统一返回null
function reasetData(data) {
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
  // 设置请求头
  config => setAuthorization(config),
  (error) => {
    // 对请求错误做些什么
    console.error(error);
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
    data: data.Code === 0 ? reasetData(data.Data) : null,
    msg: data.Message,
  };
}, (err) => {
  console.error(err);
  return {
    code: -1,
    data: null,
    msg: '',
  };
});

export default api;
