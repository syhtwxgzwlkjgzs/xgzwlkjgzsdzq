import { useStaticRendering } from 'mobx-react';
import { ENV_CONFIG } from '@common/constants/site';
import isServer from '@common/utils/is-server';
import SiteStore from './site/action';
import IndexStore from './index/action';
import UserStore from './user/action';
import ThreadStore from './thread/action';
import CommentStore from './comment/action';
import ThreadPostStore from './thread/post/action';
import UserLoginStore from './login/user-login-store';
import UserRegisterStore from './login/user-register-store';
import MobileLoginStore from './login/mobile-login-store';
import NicknameBindStore from './login/nickname-bind-store';
import SupplementaryStore from './login/supplementary-store';
import MobileBindStore from './login/mobile-bind-store';
import ResetPasswordStore from './login/reset-password-store';
import CommonLoginStore from './login/common-login-store';
import WxPhoneBindStore from './login/wx-phone-bind-store';
import MiniBindStore from './login/mini-bind-store';
import H5QrCode from './login/h5-qrcode';
import SearchStore from './search/action';
import PayBoxStore from './pay/pay-box-store';
import store from './store';

useStaticRendering(isServer());


export default function initializeStore(initProps = {}) {
  const { site = {}, user = {} } = initProps;
  if (isServer()) {
    return {
      site: new SiteStore({
        envConfig: ENV_CONFIG,
        ...site,
      }),
      index: new IndexStore(),
      user: new UserStore(user),
      thread: new ThreadStore(),
      userLogin: new UserLoginStore(),
      userRegister: new UserRegisterStore(),
      mobileLogin: new MobileLoginStore(),
      nicknameBind: new NicknameBindStore(),
      supplementary: new SupplementaryStore(),
      mobileBind: new MobileBindStore(),
      comment: new CommentStore(),
      threadPost: new ThreadPostStore(),
      h5QrCode: new H5QrCode(),
      resetPassword: new ResetPasswordStore(),
      commonLogin: new CommonLoginStore(),
      search: new SearchStore(),
      wxPhoneBind: new WxPhoneBindStore(),
      miniBind: new MiniBindStore(),
      payBox: new PayBoxStore(),
    };
  }
  if (store.getStore() === null) {
    store.setStore({
      site: new SiteStore({
        envConfig: ENV_CONFIG,
        ...site,
      }),
      index: new IndexStore(),
      user: new UserStore(user),
      thread: new ThreadStore(),
      userLogin: new UserLoginStore(),
      userRegister: new UserRegisterStore(),
      mobileLogin: new MobileLoginStore(),
      nicknameBind: new NicknameBindStore(),
      supplementary: new SupplementaryStore(),
      mobileBind: new MobileBindStore(),
      comment: new CommentStore(),
      threadPost: new ThreadPostStore(),
      h5QrCode: new H5QrCode(),
      resetPassword: new ResetPasswordStore(),
      commonLogin: new CommonLoginStore(),
      search: new SearchStore(),
      wxPhoneBind: new WxPhoneBindStore(),
      payBox: new PayBoxStore(),
      miniBind: new MiniBindStore(),
    });
  }

  return store.getStore();
}
