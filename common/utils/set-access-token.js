import locals from './local-bridge';
import constants from '../constants/index';

export const setCookie = (name, value, exdays) => {
  if (exdays) {
    const Days = 30;
    const exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${exp.toGMTString()};path=/;`;
  }
  document.cookie = `${name}=${value};path=/;`;
};

export const getCookie = (cname) => {
  let arr;
  const reg = new RegExp(`(^| )${cname}=([^;]*)(;|$)`);
  if (arr = document.cookie.match(reg)) return arr[2];
  return null;
};

const setAccessToken = ({
  accessToken,
}) => {
  if (!accessToken) return;
  const expireSeconds = 30 * 24 * 60 * 60 * 1000;
  setCookie(constants.ACCESS_TOKEN_NAME, accessToken, 30);
  locals.set(constants.ACCESS_TOKEN_NAME, accessToken, expireSeconds);
};

export default setAccessToken;
