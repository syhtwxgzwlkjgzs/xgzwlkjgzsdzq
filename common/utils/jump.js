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

// 跳转地址校验
function validateUrl(url) {
  if (isWeb()) {
    try {
      const { pathname, hash, search } = new URL(url);
      return !(pathname === '/' && !hash && !search);
    } catch (err) {
      console.erro('Jump is setting a invalid url', err);
      return false;
    }
  }
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
      url = `${url}?${options.entries(([key, value]) => `${key}=${value}`).join('&')}`;
    }
    console.log(120, 'getMiniUrl', url);
  }

  return url;
}

// 跳转登录页


class Jump {
  // 跳转地址
  constructor() {
    this.url = '';
  }

  // 记录地址
  setUrl = (url) => {
    console.log(111, 'Jump.setUrl', url);
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
    console.log(112, 'Jump.getUrl', url);

    return url;
  };

  // 清理地址
  clear = () => {
    if (isWeb() && isSessionStorage()) {
      window.sessionStorage.removeItem(JUMP_URL_LABEL);
    } else {
      this.url = '';
    }
    console.log(113, 'Jump.clearUrl');
  };

  gotoLogin = () => {
    const url = isWeb() ? '/user/login' : '/subPages/user/wx-auth/index';
    Router.redirect({ url });
  };

  // 保存当前地址
  saveCurrentUrl = () => {
    const url = getCurrentUrl();

    this.setUrl(url);
  };

  // 保存当前地址，并跳转目标地址
  saveAndRedirect = (targetUrl, isForce) => {
    console.log(114, 'saveAndRedirect', targetUrl);
    typeof isForce === 'boolean' && isForce && this.clear();

    this.saveCurrentUrl();
    Router.redirect({
      url: targetUrl,
    });
  };

  // 自动记录当前的地址，再跳转登录页
  saveAndLogin = (isForce) => {
    console.log(115, 'saveAndLogin');
    typeof isForce === 'boolean' && isForce && this.clear();
    this.saveCurrentUrl();

    this.gotoLogin();
  };

  // 恢复登录前的跳转。优先级：记录页 > defaultPage > 主页
  restore = (defaultPage) => {
    const url = this.getUrl() || defaultPage || (isWeb ? '/' : '/pages/home/index');

    Router.redirect({ url });
    console.log('jump恢复url', url)
    this.clear();

    console.log(116, 'restore', url);
  };
}

export default new Jump();
