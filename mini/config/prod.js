module.exports = {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {
    ENV_HOST: '"https://discuz.com"',
    ENV_VERSION: '"v2.3.210322"'
  },
  terser: {
    enable: true,
    config: {
      // https://github.com/terser/terser#minify-options
      warnings: false,
      compress: {
        drop_debugger: true,
        drop_console: true,
      },
      sourceMap: false,
      cache: true,
      parallel: true,
    },
  },
  csso: {
    enable: true,
    config: {
      // https://github.com/css/csso#minifysource-options
      comments: false,
    },
  },
  mini: {
    // TODO: 小程序的分包打包的优化
    // 分包优化的打包需要结合 webpackChain 和 addChunkPages
    // 具体请看：https://taro-docs.jd.com/taro/docs/next/taro-in-miniapp/#%E5%AF%B9-taro-%E9%A1%B9%E7%9B%AE%E7%9A%84%E9%83%A8%E5%88%86%E9%A1%B5%E9%9D%A2%E5%88%86%E5%8C%85
    webpackChain(chain, webpack) {
      chain.merge({
        // 可以进行打包优化分包
        optimization: {
          runtimeChunk: {
            name: 'runtime',
          },
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
              common: {
                name: 'common',
                minChunks: 2,
                priority: 1,
              },
              vendors: {
                name: 'vendors',
                minChunks: 2,
                test: module => {
                  return /[\\/]node_modules[\\/]/.test(module.resource);
                },
                priority: 10,
              },
              taro: {
                name: 'taro',
                test: module => {
                  return /@tarojs[\\/][a-z]+/.test(module.context);
                },
                priority: 100,
              },
            },
          },
        },
      });

      chain.plugin('defineDZQ')
        .use(webpack.DefinePlugin, [
          {
            'process.env.DISCUZ_ENV': JSON.stringify('mini')
          }
        ])
    },
    commonChunks: ['runtime', 'vendors', 'taro', 'common'],
  },
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  },
};
