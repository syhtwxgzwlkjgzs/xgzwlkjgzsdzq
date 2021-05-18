module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  mini: {
    // miniCssExtractPluginOption: {
    //   ignoreOrder: true
    // },
    webpackChain(chain, webpack) {
      chain.plugin()
        .use(webpack.DefinePlugin, [
          {
            'process.env.DISCUZ_ENV': JSON.stringify('mini')
          }
      ]);
    },
    commonChunks: ['runtime', 'vendors', 'taro', 'common'],
  },
  h5: {},
};
