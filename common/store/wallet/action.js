import { action } from 'mobx';
import WalletStore from './store';
import { readWalletUser, readWalletLog } from '@server';

const setWalletInfoPageData = (data, obj, {
  type,
  date,
  page,
}) => {
  if (!obj[type]) {
    obj[type] = {};
  }
  if (!obj[type][date]) {
    obj[type][date] = {};
  }
  if (!obj[type][date][page]) {
    obj[type][date][page] = data;
  }
};


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
    getInconmeDetail = async ({ ...props }) => {
      const { page = 1, date, type = 'all' } = props;
      const detailInfoRes = await readWalletLog({
        param: {
          walletLogType: 'income',
          page,
        },
      });

      if (detailInfoRes.code === 0) {
        setWalletInfoPageData(detailInfoRes.data, this.incomeDetail, {
          type,
          date,
          page,
        });
      }
    }

    // 获取支出明细
    @action
    getExpendDetail = async ({ ...props }) => {
      const { page = 1, date, type = 'all' } = props;
      const detailInfoRes = await readWalletLog({
        param: {
          walletLogType: 'expend',
          page,
        },
      });

      if (detailInfoRes.code === 0) {
        setWalletInfoPageData(detailInfoRes.data, this.expandDetail, {
          type,
          date,
          page,
        });
      }
    }

    // 获取冻结明细
    @action
    getFreezeDetail = async ({ ...props }) => {
      const { page = 1, date, type = 'all' } = props;
      const detailInfoRes = await readWalletLog({
        param: {
          walletLogType: 'freeze',
          page,
        },
      });

      if (detailInfoRes.code === 0) {
        setWalletInfoPageData(detailInfoRes.data, this.freezeDetail, {
          type,
          date,
          page,
        });
      }
    }
}

export default WalletAction;
