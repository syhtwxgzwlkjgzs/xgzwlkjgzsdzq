import PayBoxStore from './pay-box-store';
import { observable, computed, action } from 'mobx';

class PayBoxMiniStore extends PayBoxStore {
  constructor(props) {
    super(props);
  }
}

export default PayBoxMiniStore;
