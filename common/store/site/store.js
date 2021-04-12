import { observable } from 'mobx';
import { APP_THEME } from '@common/constants/site';

class SiteStore {
  constructor(props = {}) {
    this.envConfig = props.envConfig;
    this.webConfig = props.webConfig;
    this.platform = props.platform;
  }
  envConfig = {}
  @observable webConfig = null;
  @observable platform = null;
  @observable closeSiteConfig = null;
  @observable theme = APP_THEME.light;
}

export default SiteStore;
