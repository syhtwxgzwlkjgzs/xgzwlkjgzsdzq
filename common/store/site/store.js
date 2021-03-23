import { observable } from 'mobx';
import { ENV_CONFIG } from '@common/constants/site';

export default class SiteStore {
  constructor(props) {
    const { webConfig, platform } = props;
    this.webConfig = webConfig;
    this.platform = platform;
  }

  // 环境配置
  envConfig = ENV_CONFIG;
  // web 配置
  @observable webConfig = {};
  // 平台
  @observable platform = null;
}
