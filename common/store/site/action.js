import { action } from 'mobx';
import SiteStore from './store';
class SiteAction extends SiteStore {
  constructor(props) {
    super(props);
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
}

export default SiteAction;
