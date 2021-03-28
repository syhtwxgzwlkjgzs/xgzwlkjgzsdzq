import { observable } from 'mobx';
import { APP_THEME } from '@common/constants/app';

export default class AppStore {
  // 主题
  @observable theme = APP_THEME.light;
}
