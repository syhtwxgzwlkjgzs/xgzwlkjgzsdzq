import { observable, action } from 'mobx';
import SiteStore from './store';
class SiteAction extends SiteStore {
  constructor(props) {
    super(props);
  }
}

export default SiteAction;
