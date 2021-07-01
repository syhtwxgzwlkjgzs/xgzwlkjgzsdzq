/* eslint-disable prefer-destructuring */
const dataURLtoFile = (dataurl, filename = 'image') => {
  const arr = dataurl.split(',');
  let dataStr = '';
  let typeStr = 'data:image/jpg;base64';
  if (arr.length > 1) {
    [typeStr, dataStr] = arr;
  } else {
    [dataStr] = arr;
  }
  // 获取图片类型
  const mime = typeStr.match(/:(.*?);/)[1] || 'image/jpg';
  const bstr = atob(dataStr);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const wxChooseImage = () => new Promise((resolve) => {
  wx.ready(() => {
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const { localIds } = res;

        const result = await Promise.all(localIds.map(localId => (
          new Promise((resolve) => {
            // 把图片转换为本地base64格式
            wx.getLocalImgData({
              localId,
              success: (res) => {
                // 把base64转换为file对象
                const file = dataURLtoFile(res.localData);
                file.localId = localId;
                file.src = res.localData;
                resolve(file);
              },
            });
          })
        )));


        // const result = await Promise.all(localIds.map(localId => (
        //   new Promise((resolve) => {
        //     wx.uploadImage({
        //       localId,
        //       isShowProgressTips: 0,
        //       success: (res) => {
        //         const { serverId } = res;
        //         resolve({
        //           localId,
        //           serverId,
        //         });
        //       },
        //     });
        //   })
        // )));

        // 返回结果
        resolve(result);
      },
    });
  });
});

export default wxChooseImage;

