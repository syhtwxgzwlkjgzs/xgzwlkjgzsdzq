/* eslint-disable */

import html2canvas from 'html2canvas'

export const generateImageUrlByHtml = (element) => {
  // A polyfill based on toBlob.
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback, type, quality) {
        const binStr = atob(this.toDataURL(type, quality).split(',')[1])
        const len = binStr.length
        const arr = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i)
        }
        callback(new Blob([arr], { type: type || 'image/png' }))
      },
    })
  }
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
      })
      const blobUrl = canvas.toDataURL('image/png')
      resolve(blobUrl)
    } catch (error) {
      reject(error)
    }
  })
}

export const savePic = (Url) => {
  var triggerEvent = "touchstart"; //指定下载方式
  var blob=new Blob([''], {type:'application/octet-stream'}); //二进制大型对象blob
  var url = URL.createObjectURL(blob); //创建一个字符串路径空位
  var a = document.createElement('a'); //创建一个 a 标签
  a.href = Url;  //把路径赋到a标签的href上
    //正则表达式，这里是把图片文件名分离出来。拿到文件名赋到a.download,作为文件名来使用文本
  a.download = Url.replace(/(.*\/)*([^.]+.*)/ig,"$2").split("?")[0]; 
    
  var e = new MouseEvent('click', ( true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null));  
  //派遣后，它将不再执行任何操作。执行保存到本地
  a.dispatchEvent(e);
    //释放一个已经存在的路径（有创建createObjectURL就要释放revokeObjectURL）
  URL.revokeObjectURL(url);  
}
