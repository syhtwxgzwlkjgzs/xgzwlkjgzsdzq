import { observable } from 'mobx';

class SiteStore {
  constructor(props = {}) {
    this.envConfig = props.envConfig;
    this.webConfig = props.webConfig;
    this.platform = props.platform;
  }
  envConfig = {}
  @observable webConfig = null
  @observable platform = null
}

export default SiteStore;
