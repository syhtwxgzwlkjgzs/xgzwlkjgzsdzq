const path = require('path');

const config = {
  projectName: 'discuz-app-mini',
  date: '2021-2-19',
  // https://taro-docs.jd.com/taro/docs/size
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
  },
  alias: {
    '@constants': path.resolve(__dirname, '..', 'src/constants'),
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@utils': path.resolve(__dirname, '..', 'src/utils'),
    '@pages': path.resolve(__dirname, '..', 'src/pages'),
    '@store': path.resolve(__dirname, '..', 'src/store'),
    '@styles': path.resolve(__dirname, '..', 'src/styles'),
    '@config': path.resolve(__dirname, '..', 'config'),
    '@common': path.resolve(__dirname, '../../common'),
  },
  copy: {
    patterns: [
    ],
    options: {
    },
  },
  framework: 'react',
  mini: {
    compile: {
      include: [
        path.resolve(__dirname, '../../common'),
      ],
    },
    webpackChain(chain, webpack) {
      chain.plugin('defineDZQ')
        .use(webpack.DefinePlugin, [
          {
            'process.env.DISCUZ_ENV': JSON.stringify('mini')
          }
        ]);
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
