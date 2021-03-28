import { action } from 'mobx';
import AppStore from './store';

export default class AppAction extends AppStore {
  @action.bound
  changeTheme(theme) {
    this.theme = theme;
  }
}
