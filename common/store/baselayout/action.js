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
    this.jumpToScrollingPos = -1;
    this.isJumpingToTop = true;
  }

  /**
   * 设置跳回页面头部
   */
  @action
  removeJumpingToTop() {
    this.isJumpingToTop = false;
  }

  /**
   * 设置跳回页面头部
   */
   @action
   setSearch(data) {
     this.search = data;
   }
}

export default IndexAction;
