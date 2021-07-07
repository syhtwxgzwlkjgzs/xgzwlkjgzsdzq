// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: false,
    }],
  ],
  plugins: [
    [
      "@discuzq/discuz-babel-plugin-import",
      {
        "libraryName": "@discuzq/design",
        "libraryDirectory": "dist/components"
      }
    ]
  ]
};
