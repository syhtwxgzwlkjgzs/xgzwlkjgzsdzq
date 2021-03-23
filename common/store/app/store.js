import { observable } from 'mobx';

export default class AppStore {
  // 主题
  @observable theme = 'light'
}
