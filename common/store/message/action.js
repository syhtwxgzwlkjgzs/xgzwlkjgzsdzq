import { action } from 'mobx';
import SiteStore from './store';
import { readUser, readPermissions } from '@server';

class MessageAction extends SiteStore {
  constructor(props) {
    super(props);
  }
}

export default MessageAction;
