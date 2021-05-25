import { action } from 'mobx';
import WalletStore from './store';
import { readWalletUser, readWalletLog, readWalletCash } from '@server';
import { time } from '@discuzq/sdk/dist/index';

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
      const { page = 1, date = time.formatDate(new Date(), 'YYYY-MM'), type = 'all' } = props;
      const param = {
        walletLogType: 'income',
        page,
      };
      const filter = {
        startTime: time.getMonthStartAndEnd(date)[0],
        endTime: time.getMonthStartAndEnd(date)[1],
      };
      if (type !== 'all') {
        filter.changeType = type;
      }

      Object.assign(param, {
        filter,
      });
      const detailInfoRes = await readWalletLog({
        param,
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
      const { page = 1, date = time.formatDate(new Date(), 'YYYY-MM'), type = 'all' } = props;
      const param = {
        walletLogType: 'expend',
        page,
      };
      const filter = {
        startTime: time.getMonthStartAndEnd(date)[0],
        endTime: time.getMonthStartAndEnd(date)[1],
      };
      if (type !== 'all') {
        filter.changeType = type;
      }
      Object.assign(param, {
        filter,
      });

      const detailInfoRes = await readWalletLog({
        param,
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
        if (detailInfoRes.code === 0) {
          if (!this.freezeDetail[date]) {
            this.freezeDetail[date] = {};
          }
          this.freezeDetail[date][page] = detailInfoRes.data;
        }
      }
    }

    // 获取提现明细
    @action
    getCashLog = async ({ ...props }) => {
      const { page = 1, date, type = 'all' } = props;
      const param = {
        page,
      };

      const filter = {
        start_time: time.getMonthStartAndEnd(date)[0],
        end_time: time.getMonthStartAndEnd(date)[1],
      };
      if (type !== 'all') {
        filter.cash_status = type;
      }

      Object.assign(param, {
        filter,
      });

      const cashInfoRes = await readWalletCash({
        param,
      });

      setWalletInfoPageData(cashInfoRes.data, this.cashDetail, {
        type,
        date,
        page,
      });
    }
}

export default WalletAction;
