import Toast from '@discuzq/design/dist/components/toast';
import Taro from '@tarojs/taro';
// 汉字算2个字符，字母数字算1.2个
export const getByteLen = (val) => {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        const a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
        } else {
            len += 1.2;
        }
    }
    return len;
}

const openConfirm =  function () {
    Taro.showModal({
      content: '检测到您没打开此小程序的相机权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success (res) {
        // 点击“确认”时打开设置页面
        if (res.confirm) {
          Taro.openSetting({
            success: () => { }
          })
        } else {
          Toast.error({
            content: '授权失败',
            icon: 'none',
            duration: 2000,
          });
        }
      }
    });
}

export const saveToAlbum = (shareImage) => () => {
        Taro.getSetting().then(mes => {
            if (mes.authSetting['scope.writePhotosAlbum']) {
              Taro.saveImageToPhotosAlbum({
                filePath: shareImage,
                success: (res)=> {
                  if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                    Toast.info({
                      content: '保存图片成功',
                      icon: 'success',
                      duration: 2000,
                    });
                  }
                },
                fail: () => {
                  Toast.error({
                    content: '保存图片失败',
                    icon: 'none',
                    duration: 2000,
                  });
                }
              })
            } else {
              Taro.authorize({
                scope: 'scope.writePhotosAlbum',
                fail: () => {
                  openConfirm()
                }
              })
            }
          })
          };