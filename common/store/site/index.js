import { action } from 'mobx';
import SiteStore from './store';

export default class SiteAction extends SiteStore {
  @action
  setPlatfrom(platform) {
    this.platform = platform;
  }

  @action
  setWebConfig(config = {}) {
    this.webConfig = config;
  }
}
