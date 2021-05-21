import { observable, computed } from 'mobx';
import { APP_THEME } from '@common/constants/site';
import { get } from '../../utils/get';

const WECHAT_ENV_MAP = {
  MINI: 'miniProgram',
  OPEN: 'openPlatform',
  NONE: 'none',
};

class SiteStore {
  constructor(props = {}) {
    this.envConfig = props.envConfig;
    this.webConfig = props.webConfig;
    this.platform = props.platform;
  }

  envConfig = {};
  @observable webConfig = null;
  @observable platform = null;
  @observable closeSiteConfig = null;
  @observable theme = APP_THEME.light;

  @observable isUserLoginVisible = null;

  @computed get isRegister() {
    return !this.isSmsOpen && this.wechatEnv === 'none';
  }

  @computed get isPC() {
    return this.platform === 'pc';
  }

  @computed get isSmsOpen() {
    return get(this.webConfig, 'qcloud.qcloudSms', false);
  }

  @computed get isMiniProgramOpen() {
    return Boolean(get(this.webConfig, 'passport.miniprogramOpen', true));
  }
  // 公众平台是否开启
  @computed get isOffiaccountOpen() {
    return Boolean(get(this.webConfig, 'passport.offiaccountOpen', true));
  }

  // 站点 icon 路径
  @computed get siteIconSrc() {
    return get(this.webConfig, 'setSite.siteLogo');
  }

  @computed get wechatEnv() {
    if (this.isMiniProgramOpen) {
      return WECHAT_ENV_MAP.MINI;
    }

    if (this.isOffiaccountOpen) {
      return WECHAT_ENV_MAP.OPEN;
    }

    return WECHAT_ENV_MAP.NONE;
  }
}

export default SiteStore;
