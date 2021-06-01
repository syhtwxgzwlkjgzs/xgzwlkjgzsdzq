参数，

```javascript
/**
 * @param needShareline 是否需要分享到朋友圈
 * @param comeFrom 来自哪个页面
 */
```

在需要转发的地方使用button，并添加上属性`openType='share'`  ,然后注意UI变化，要给button添加属性`plain=true` ，将button设置为镂空样式，取消button的内外边距和边框

如果一个页面上有多个分享，给按钮添加自定义属性，区分来自哪个按钮。

在需要注入的页面通过`@withShare({})` 的方式引入，并将需要的参数传入

```javascript
return {
  path://默认分享首页
  title://默认为Discuz!Q
  image://分享到朋友圈的缩略图需要在这里设置，如果分享给朋友默认图片为当前页面的70%
}
```

在`@commo/utils/withShare` 文件中，

点击按钮分享给朋友，在 `onShareMessageApp` 增加一个判断，判断来自哪个按钮，然后将需要返回的值写在return中，

右上角分享给朋友，需要在`res.from === 'menu'` 的判断中再添加一个判断，判断来自哪个页面，然后将需要返回的值为return中，

右上角分享到朋友圈，在`onShareline` 中增加一个判断，判断来自哪个页面，然后将需要返回的值写在return中

