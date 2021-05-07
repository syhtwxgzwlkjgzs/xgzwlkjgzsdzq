import { observable, action } from 'mobx';

export default class ForumStore {
    @observable isPopup = false;

    @action
    setIsPopup = (boolean = true) => {
      this.isPopup = boolean;
    }
}
