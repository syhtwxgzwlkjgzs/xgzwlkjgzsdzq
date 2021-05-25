import { observable, computed } from 'mobx';
import { get } from '../../utils/get';

class WalletStore {
    // 钱包明细
    @observable walletInfo = {}

    // 收入明细
    @observable incomeDetail = {}

    // 支出明细
    @observable expandDetail = {}

    // 冻结明细
    @observable freezeDetail = {}

    // 体现明细
    @observable cashDetail = {}
}

export default WalletStore;
