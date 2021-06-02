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

    // 用户钱包可用余额
    @computed get walletAvaAmount() {
        return get(this.walletInfo, 'availableAmount');
    }

}

export default WalletStore;
