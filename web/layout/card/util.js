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

export const getBase64 = (img) => {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  const dataURL = canvas.toDataURL('image/png') // 可选其他值 image/jpeg
  return dataURL
}

export const getBase64ByImageUrl = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = '*' // 必须在image之前赋值
    image.src = url
    image.onload = function () {
      const base64 = getBase64(image)
      resolve(base64)
    }
    image.onerror = function (err) {
      console.log(url + '图片加载失败' + err)
      reject('图片加载失败' + url)
    }
  })
}
