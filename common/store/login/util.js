import { get } from '../../utils/get';

export const COMMON_LOGIN_STORE_ERRORS = {
  NEED_BIND_USERNAME: {
    Code: 'common_0001',
    Message: '需要补充昵称',
  },
  NEED_COMPLETE_REQUIRED_INFO: {
    Code: 'common_0002',
    Message: '需要补充附加信息',
  },
  NEED_ALL_INFO: {
    Code: 'common_0003',
    Message: '需要补充昵称和附加信息',
  },
  BAND_USER: {
    Code: 'common_0004',
    Message: '用户被禁用',
  },
  REVIEWING: {
    Code: 'common_0005',
    Message: '审核中',
  },
  REVIEW_REJECT: {
    Code: 'common_0006',
    Message: '审核拒绝',
  },
  REVIEW_IGNORE: {
    Code: 'common_0007',
    Message: '审核忽略',
  },
  NEED_BIND_WECHAT: {
    Code: 8000,
    Message: '需要绑定微信',
  },
};

const USER_STATUS_MAP = {
  1: COMMON_LOGIN_STORE_ERRORS.BAND_USER,
  2: COMMON_LOGIN_STORE_ERRORS.REVIEWING,
  3: COMMON_LOGIN_STORE_ERRORS.REVIEW_REJECT,
  4: COMMON_LOGIN_STORE_ERRORS.REVIEW_IGNORE,
};

const throwFormattedError = (error) => {
  if (error.code) {
    throw error;
  }
};

const networkRequestCatcher = async () => {
  try {

  } catch (error) {
    throwFormattedError(error);
    throw {
      Code: '9999',
      Message: '网络错误',
    };
  }
};

const checkCompleteUserInfo = (resp) => {
  const isMissNickname = get(resp, 'data.isMissNickname', false);
  const isMissRequireInfo = get(resp, 'data.userStatus') === 10;

  if (isMissRequireInfo && isMissNickname) {
    throw COMMON_LOGIN_STORE_ERRORS.NEED_ALL_INFO;
  }

  if (isMissNickname) {
    throw COMMON_LOGIN_STORE_ERRORS.NEED_BIND_USERNAME;
  }

  if (isMissRequireInfo) {
    throw COMMON_LOGIN_STORE_ERRORS.NEED_COMPLETE_REQUIRED_INFO;
  }
};

/**
* 检查用户状态，用来跳转状态页面
* @param {*} smsLoginResp
*/
const checkUserStatus = (smsLoginResp) => {
  const userStatus = get(smsLoginResp, 'userStatus');
  if (USER_STATUS_MAP[userStatus]) {
    throw USER_STATUS_MAP[userStatus];
  }
  return;
};

export { throwFormattedError, networkRequestCatcher, checkCompleteUserInfo, checkUserStatus };
