
import { createWalletCash } from '@discuzq/sdk/dist/api/wallet/read-walletcash';
export default async function _createWalletCash(opts, ctx = null) {
  const res = await createWalletCash({ ...opts, __context: ctx });
  return res;
}
