const getDefinePlugin = require('@discuzq/cli/config/taro/getDefinePlugin');

module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    webpackChain(chain, webpack) {
      const defaultDefinePlugin = getDefinePlugin();
      chain.plugin()
        .use(webpack.DefinePlugin, [
          {
            ...defaultDefinePlugin
          }
      ]);
    },
    commonChunks: ['runtime', 'vendors', 'taro', 'common'],
  },
  h5: {},
};
