module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    ENV_HOST: '"https://discuz.dnspord.com"',
    ENV_VERSION: '"v2.3.210322"'
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
