// 收入明细筛选类型
export const INCOME_DETAIL_CONSTANTS = {
  REWARD_INCOME: {
    text: '打赏收入',
    code: 31,
  },
  LABOR_INCOME: {
    text: '人工收入',
    code: 32,
  },
  REDPACK_INCOME: {
    text: '红包收入',
    code: 151,
  },
  REDPACK_RETURN: {
    text: '红包退回',
    code: 152,
  },
  OFFER_REWARD_INCOME: {
    text: '悬赏收入',
    code: 161,
  },
  OFFER_REWARD_RETURN: {
    text: '悬赏退回',
    code: 162,
  },
  // TODO: 后台需要补充该类型
  PAID_INCOME: {
    text: '付费收入',
  },
};

// 支出明细筛选类型
export const EXPAND_DETAIL_CONSTANTS = {
  REGISTER_EXPAND: {
    text: '注册支出',
    code: 71,
  },
  LABOR_EXPAND: {
    text: '人工支出',
    code: 50,
  },
  REWARD_EXPAND: {
    text: '打赏支出',
    code: 41,
  },
  PAID_EXPAND: {
    text: '付费支出',
    // TODO: 后台需要补充该类型
  },
  REDPACK_EXPAND: {
    text: '红包支出',
    code: 153,
  },
  OFFER_REWARD_RETURN: {
    text: '悬赏支出',
    // TODO: 后台需要补充该类型
  },
};

// 提现明细筛选状态
export const CASH_DETAIL_CONSTANTS = {
  PENDING_REVIEW: {
    text: '待审核',
    code: 1,
  },
  REVIEW_PASSED: {
    text: '审核通过',
    code: 2,
  },
  REVIEW_NOT_PASSED: {
    text: '审核不通过',
    code: 3,
  },
  REMITTANCE: {
    text: '打款中',
    code: 4,
  },
  REMITTANCE_COMPLETED: {
    text: '已打款',
    code: 5,
  },
  REMITTANCE_FAILED: {
    text: '打款失败',
    code: 6,
  },
};
