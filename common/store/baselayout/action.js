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
  setJumpingToTop() {
    this.home = -1;
    this.search = -1;
    this.isJumpingToTop = true;
  }

  /**
   * 设置跳回页面头部
   */
  @action
  removeJumpingToTop() {
    this.isJumpingToTop = false;
  }

}

export default IndexAction;
