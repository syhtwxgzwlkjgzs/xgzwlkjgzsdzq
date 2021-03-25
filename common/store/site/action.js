import { observable, action } from 'mobx';
import SiteStore from './store';
class SiteAction extends SiteStore {
  constructor(props) {
    super(props);
  }

  @action
  setSiteConfig(config) {
    this.webConfig = config;
  }
}

export default SiteAction;
