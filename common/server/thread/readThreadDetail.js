import api from '../api';
import MockData from '../../store/thread/data';

export default async function readThreadDetail(opts, ctx = null) {
  const res = await api.readThreadDetail({ ...opts, __context: ctx });
  // return res;
  return MockData.thread;
}
