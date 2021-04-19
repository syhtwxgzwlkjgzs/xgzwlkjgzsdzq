import api from './api';
import MockData from '../store/thread/data';

export default async function readCommentList(opts, ctx = null) {
  const res = await api.readCommentList({ ...opts, __context: ctx });

  // return res;
  return MockData.comment;
}
