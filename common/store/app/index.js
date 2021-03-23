import { action } from 'mobx';
import AppStore from './store';

class AppAction extends AppStore {
  @action.bound
  changeTheme(theme) {
    this.theme = theme;
  }
}

const app = new AppAction();
export default app;
