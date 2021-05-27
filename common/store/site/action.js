import { action } from 'mobx';
import { readUserLoginDisplay } from '@server';
import SiteStore from './store';
import { get } from '../../utils/get';

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

}

export default SiteAction;
