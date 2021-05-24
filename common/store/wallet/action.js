import { action } from 'mobx';
import WalletStore from './store';
import { readWalletUser, readWalletLog } from '@server';
import { get } from '../../utils/get';
import set from '../../utils/set';


class WalletAction extends WalletStore {
    @action
    getUserWalletInfo = async () => {
      const walletInfoRes = await readWalletUser();
      if (walletInfoRes.code === 0) {
        this.walletInfo = walletInfoRes.data;
      }
    }

    // 获取收入明细
    @action
    getInconmeDetail = async ({
      page = 1,
    }) => {
      const detailInfoRes = await readWalletLog({
        param: {
          walletLogType: 'income',
          page,
        },
      });
    }

    // 获取支出明细
    @action
    getExpendDetail = async ({
      page = 1,
    }) => {
      const detailInfoRes = await readWalletLog({
        param: {
          walletLogType: 'expend',
          page,
        },
      });
    }

    // 获取冻结明细
    @action
    getFreezeDetail = async ({
      page = 1,
    }) => {
      const detailInfoRes = await readWalletLog({
        param: {
          walletLogType: 'freeze',
          page,
        },
      });
    }
}

export default WalletAction;
