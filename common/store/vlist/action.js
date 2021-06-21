import { action } from 'mobx';
import IndexStore from './store';

class IndexAction extends IndexStore {
  constructor(props) {
    super(props);
  }

  /**
   * 设置跳回页面头部
   */
  @action
  setPosition(position) {
    this.home = position;
  }

  @action
  setCache(cache) {
    this.cache = cache;
  }
}

export default IndexAction;
