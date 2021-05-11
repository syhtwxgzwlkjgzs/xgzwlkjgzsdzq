import api from '../api';
import set from '../../utils/set';
import deepClone from '../../utils/deep-clone';

export default async function getUserFans(opts, ctx) {
  const options = deepClone(opts);
  set(options, 'params.filter.type', 2);
  const res = await api.readFollow({ ...options, __context: ctx });
  return res;
}
