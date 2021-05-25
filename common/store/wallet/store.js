import { observable, computed } from 'mobx';
import { get } from '../../utils/get';

class WalletStore {
    @observable walletInfo = {}

    // 收入明细
    @observable incomeDetail = {}

    // 支出明细
    @observable expandDetail = {}

    // 冻结明细
    @observable freezeDetail = {}
}

export default WalletStore;
