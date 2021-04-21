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
  NEED_BIND_WECHAT: {
    Code: 8000,
    Message: '需要绑定微信',
  },
};

export const BANNED_USER = -4009; // 禁用
export const REVIEWING = 2; // 审核
export const REVIEW_REJECT = -4007; // 审核拒绝

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
 * 检查用户是否处于需要调整状态页
 * @param {*} resp
 */
const checkUserStatus = (resp) => {
  if (resp.code === 0) {
    const rejectReason = get(resp, 'data.rejectReason', '');
    const status = get(resp, 'data.userStatus', 0);
    if (status ===  REVIEWING) {
      throw {
        Code: status,
        Message: rejectReason,
      };
    }
  }

  if (resp.code === BANNED_USER || resp.code === REVIEW_REJECT) {
    throw {
      Code: resp.code,
      Message: get(resp, 'data.rejectReason', ''),
    };
  }
};

export { throwFormattedError, networkRequestCatcher, checkCompleteUserInfo, checkUserStatus };
