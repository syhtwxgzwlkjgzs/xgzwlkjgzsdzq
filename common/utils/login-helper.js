import Router from '@discuzq/sdk/dist/router';

// 记录用户访问的初始地址，用户登陆、付费等操作后跳回
const JUMP_URL_LABEL = '__jump_url';

// web环境判断
function isWeb() {
  return process.env.DISCUZ_ENV === 'web';
}

// sessionStorage是否可用
function isSessionStorage() {
  return typeof window !== 'undefined' && window.sessionStorage;
}

// 跳转地址校验(不合法地址，以及不需要跳转的地址在此处理)
function validateUrl(url) {
  if (typeof url !== 'string') {
    console.log('LoginHelper Error: the url is not a string', url);
    return false;
  }

  if (isWeb()) {
    try {
      // 相对地址转绝对地址
      let absUrl = url;
      if (url.startsWith('/')) {
        absUrl = `${window.location.origin}${url}`;
      }

      const { pathname, hash, search } = new URL(absUrl);
      return !(pathname === '/' && !hash && !search);
    } catch (err) {
      console.error('LoginHelper is setting a invalid url', url, absUrl, err);
      return false;
    }
  }

  // mini端首页地址
  return !['pages/index/index', 'pages/home/index'].includes(url);
}

// 获取当前的url
function getCurrentUrl() {
  let url = '';

  if (isWeb()) {
    url = window.location.href;
  } else {
    // 小程序
    const pages = getCurrentPages();
    const { route, options } = pages[pages.length - 1];

    url = route;
    if (Object.keys(options).length > 0) {
      url = `${route}?${Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&')}`;
    }
  }
  console.log('LoginHelper: getCurrentUrl', url);

  return url;
}

// 跳转登录页

class LoginHelper {
  // 跳转地址
  constructor() {
    this.url = '';
  }

  // 记录地址
  setUrl = (url) => {
    // 如果已存在跳转地址，不能在此写入，除非先清空
    if (this.getUrl()) {
      console.log('jump url already exists');
      return false;
    }

    // 不带参数的首页地址，不做记录
    if (!validateUrl(url)) {
      return false;
    }

    // 区分web记录地址
    if (isWeb() && isSessionStorage()) {
      window.sessionStorage.setItem(JUMP_URL_LABEL, url);
    } else {
      this.url = url;
    }
    console.log('LoginHelper: setUrl', url);

    return true;
  };

  // 读取地址
  getUrl = () => {
    let url = '';

    if (isWeb()) {
      url = isSessionStorage() ? window.sessionStorage.getItem(JUMP_URL_LABEL) : this.url;
    } else if (this.url) {
      url = `${this.url.startsWith('/') ? '' : '/'}${this.url}`;
    }
    console.log('LoginHelper: getUrl', url);

    return url;
  };

  // 清理地址
  clear = () => {
    if (isWeb() && isSessionStorage()) {
      window.sessionStorage.removeItem(JUMP_URL_LABEL);
    } else {
      this.url = '';
    }
    console.log('LoginHelper: clear');
  };

  gotoLogin = () => {
    const url = isWeb() ? '/user/login' : '/subPages/user/wx-auth/index';
    Router.redirect({ url });
  };

  // 保存当前地址
  saveCurrentUrl = () => {
    const url = getCurrentUrl();

    this.setUrl(url);
    console.log('LoginHelper: saveCurrentUrl', url);
  };

  // 保存当前地址，并跳转目标地址targetUrl
  saveAndRedirect = (targetUrl, isForce) => {
    typeof isForce === 'boolean' && isForce && this.clear();
    this.saveCurrentUrl();

    Router.redirect({
      url: targetUrl,
    });
    console.log('LoginHelper: saveAndRedirect', targetUrl);
  };

  // 自动记录当前的地址，再跳转登录页
  saveAndLogin = (isForce) => {
    typeof isForce === 'boolean' && isForce && this.clear();
    this.saveCurrentUrl();

    this.gotoLogin();
    console.log('LoginHelper: saveAndLogin');
  };

  // 指定登陆后跳转到redirectUrl页面(默认清空当前的记录的跳转地址)
  setAndLogin = (redirectUrl) => {
    this.clear();
    this.setUrl(redirectUrl);

    this.gotoLogin();
    console.log('LoginHelper: setAndLogin');
  };

  // 恢复登录前的跳转。优先级：记录页 > defaultPage > 主页
  restore = (defaultPage) => {
    const url = this.getUrl() || defaultPage || (isWeb ? '/' : '/pages/home/index');

    Router.redirect({ url });
    this.clear();
    console.log('LoginHelper: restore', url);
  };
}

export default new LoginHelper();
