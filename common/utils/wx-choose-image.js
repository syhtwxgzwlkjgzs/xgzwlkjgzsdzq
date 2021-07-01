const wxChooseImage = () => new Promise((resolve) => {
  wx.ready(() => {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const { localIds } = res;

        const result = await Promise.all(localIds.map(localId => (
          new Promise((resolve) => {
            wx.uploadImage({
              localId,
              isShowProgressTips: 0,
              success: (res) => {
                const { serverId } = res;
                resolve({
                  localId,
                  serverId,
                });
              },
            });
          })
        )));

        // 返回结果
        resolve(result);
      },
    });
  });
});

export default wxChooseImage;

