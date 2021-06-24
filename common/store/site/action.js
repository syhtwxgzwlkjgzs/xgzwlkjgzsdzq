import { action } from 'mobx';
import { readUserLoginDisplay, readForum } from '@server';
import SiteStore from './store';
import { get } from '../../utils/get';

const INITIAL_PAGE_LABEL = '_initialPage';

class SiteAction extends SiteStore {
  constructor(props) {
    super(props);
  }

  @action
  setPlatform(platform) {
    if (platform !== this.platform) {
      this.platform = platform;
    }
  }

  @action
  async getSiteInfo() {
    const siteResult = await readForum({});
    siteResult.data && this.setSiteConfig(siteResult.data);
  }

  @action
  setSiteConfig(config) {
    this.webConfig = config;
  }

  @action
  setCloseSiteConfig(config) {
    this.closeSiteConfig = config;
  }

  @action.bound
  changeTheme(theme) {
    this.theme = theme;
  }

  @action
  getUserLoginEntryStatus = async () => {
    /**
     * 获取是否展示用户名登录入口
     */
    try {
      const readResp = await readUserLoginDisplay({});

      if (get(readResp, 'code') === 0) {
        this.isUserLoginVisible = true;
      } else {
        // 如果没开短信，也没配微信，用户名接口默认返回 true
        if (!this.isSmsOpen && this.wechatEnv === 'none') {
          this.isUserLoginVisible = true;
          return;
        }
        this.isUserLoginVisible = false;
      }
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      this.isUserLoginVisible = false;
      throw {
        Code: 'site_9999',
        Message: '网络错误',
        error,
      };
    }
  }

  // 检查是否开启默认数据
  checkSiteIsOpenDefautlThreadListData() {
    if (this.webConfig && this.webConfig.setSite && this.webConfig.setSite.siteOpenSort) {
      return true;
    }
    return false;
  }


  // 记录用户访问的初始地址，用户登陆、付费等操作后跳回
  _initialPage = '';
  @action
  setInitialPage(pageUrl) {
    // 不带参数的首页地址，不做记录
    if (process.env.DISCUZ_ENV === 'web') {
      const { pathname, hash, search } = new URL(pageUrl);
      if (pathname === '/' && !hash && !search) {
        return;
      }
    } else {
      if (['pages/index/index', 'pages/home/index'].includes(pageUrl)) {
        return;
      }
    }

    // 区分web记录地址
    if (process.env.DISCUZ_ENV === 'web' && window?.sessionStorage) {
      window.sessionStorage.setItem(INITIAL_PAGE_LABEL, pageUrl);
    } else {
      this._initialPage = pageUrl;
    }
  }
  @action
  clearInitialPage() {
    if (process.env.DISCUZ_ENV === 'web' && window?.sessionStorage) {
      window.sessionStorage.removeItem(INITIAL_PAGE_LABEL);
    } else {
      this._initialPage = '';
    }
  }
  @action
  getInitialPage() {
    let url = '';

    if (process.env.DISCUZ_ENV === 'web') {
      url = window?.sessionStorage ? window.sessionStorage.getItem(INITIAL_PAGE_LABEL) : this._initialPage;
    } else if (this._initialPage) {
      url = `${this._initialPage.startsWith('/')  ? '' : '/'}${this._initialPage}`
    }


    return url;
  }
}

export default SiteAction;
