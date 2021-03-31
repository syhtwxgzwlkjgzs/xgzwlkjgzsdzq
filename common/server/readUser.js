import api from './api';
export default async function readUser(opts, ctx = null) {
    const res = await api.readUser({...opts, __context: ctx});
    return res;
}