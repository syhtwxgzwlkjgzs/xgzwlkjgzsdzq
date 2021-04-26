export const STEP_MAP = {
  SURE: 'sure', // 订单确认阶段
  PAYWAY: 'payway', // 选择支付方式阶段
  PAY: 'pay', // 付费阶段
  WALLET_PASSWORD: 'walletPassword', // 钱包密码输入阶段
  RESULT: 'result', // 付费完成后确认付费信息阶段
};

// 支付模式映射表
export const PAYWAY_MAP = {
  WX: 'weixin', // 微信支付
  WALLET: 'wallet', // 钱包支付
};

// 微信支付状态映射表
export const WX_PAY_STATUS = {
  WX_PAY_OK: 'get_brand_wcpay_request:ok',
  WX_PAY_CANCEL: 'get_brand_wcpay_request:cancel',
  WX_PAY_FAIL: 'get_brand_wcpay_request:fail',
};

// 支付方式映射表
export const PAY_MENT_MAP = {
  WX_QRCODE: 10,
  WX_H5: 11,
  WX_OFFICAL: 12,
  WX_MINI_PROGRAM: 13,
  WALLET: 20,
};

// 订单状态映射表
export const ORDER_STATUS_MAP = {
  PENDING_PAY: 0,
  PAID: 1,
  CANCEL_PAY: 2,
  FAIL_PAY: 3,
  OUT_DATE_PAY: 4,
};

export const PAY_BOX_ERROR_CODE_MAP = {
  NOT_IN_WEIXIN_PAY: {
    Code: 'pbx_0001',
    Message: '微信外浏览器无法拉起付款',
  },
  IN_IOS: {
    Code: 'pbx_0002',
    Message: '由于相关规范，IOS系统且微信内，禁止进行此操作，请更换其它途径操作',
  },
  WX_PAY_CANCEL: {
    Code: 'pbx_0003',
    Message: '微信支付取消',
  },
  WX_PAY_FAIL: {
    Code: 'pbx_0004',
    Message: '微信支付拉起失败',
  },
  NETWORK_ERROR: {
    Code: 'pbx_9999',
    Message: '网络错误',
  },
};
