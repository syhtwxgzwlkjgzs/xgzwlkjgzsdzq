module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  mini: {
    webpackChain(chain, webpack) {
      chain.plugin('defineDZQ')
        .use(webpack.DefinePlugin, [
          {
            'process.env.DISCUZ_ENV': JSON.stringify('mini')
          }
        ])
    },
    commonChunks: ['runtime', 'vendors', 'taro', 'common'],
  },
  h5: {},
};
