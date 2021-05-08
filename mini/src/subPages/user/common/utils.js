import Taro from '@tarojs/taro';

/**
 * 获取登录信息
 * @returns 登录信息
 */
export const getParamCode = (commonLogin) => new Promise((resolve, reject) => {
    Taro.login({
      success: (res) => {
        if(res.errMsg === 'login:ok'){
          commonLogin.setJsCode(res.code)
          return resolve(res);
        }
        reject(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })


/**
 * 获取用户信息
 * @returns 用户信息
 */
export const getUserProfile = (callback) => new Promise((resolve, reject) => {
  Taro.getUserProfile({
    desc: "账号绑定微信",
    success: (res) => {
      if(res.errMsg === 'getUserProfile:ok'){
        callback(res);
        return resolve(res);
      }
      reject(res);
    },
    fail: (res) => {
      console.log('res', res);
    }
  })
})

