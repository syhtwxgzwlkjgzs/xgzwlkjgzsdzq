import { action } from 'mobx';
import { readUserLoginDisplay, readForum, getMiniCode } from '@server';
import SiteStore from './store';
import { get } from '../../utils/get';
import locals from '@common/utils/local-bridge';
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

  @action.bound
  async getMiniCode(data) {
    this.miniCode = await getMiniCode(data);
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

  // 用户访问起始页面
  EXPIRATION_SECONDS = 10 * 60; // 记录的跳转地址10min内有效
  @action
  setInitialPage(pageUrl) {
    locals.set('initialPage', pageUrl, this.EXPIRATION_SECONDS);
  }
  @action
  clearInitialPage() {
    locals.remove('initialPage');
  }
  // 读取并清空记录的初始页面地址
  @action
  getInitialPage() {
    let url = locals.get('initialPage')

    if (url && process.env.DISCUZ_ENV !== 'web') {
      url = `/${url}`
    }

    return url;
  }
}

export default SiteAction;
