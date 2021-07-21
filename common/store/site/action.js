import { action } from 'mobx';
import { readForum } from '@server';
import SiteStore from './store';

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

  @action
  setErrPageType(type) {
    this.errPageType = type;
  }

  @action.bound
  changeTheme(theme) {
    this.theme = theme;
  }

  // 是否开启用户名登陆
  @action
  initUserLoginEntryStatus = () => {
    if (this.webConfig?.setSite?.usernameLoginIsdisplay) {
      this.isUserLoginVisible = true;
    } else {
      // 如果没开短信，也没配微信，用户名接口默认返回 true
      this.isUserLoginVisible = !this.isSmsOpen && this.wechatEnv === 'none'
    }
  }

  // 检查是否开启默认数据
  checkSiteIsOpenDefautlThreadListData() {
    if (this.webConfig && this.webConfig.setSite && this.webConfig.setSite.siteOpenSort) {
      return true;
    }
    return false;
  }
}

export default SiteAction;
