import api from '../api';
import set from '../../utils/set';
import deepClone from '../../utils/deep-clone';

export default async function getUserFans(opts, ctx) {
  const options = deepClone(opts);
  set(options, 'filter.type', 2);
  const res = await api.readFollow({ ...opts, __context: ctx });
  return res;
}
