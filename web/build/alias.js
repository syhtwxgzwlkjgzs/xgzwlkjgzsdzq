const path = require('path');
const cwd = process.cwd();

module.exports = (config) => {
  // eslint-disable-next-line no-param-reassign
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    '@component': path.resolve(cwd, './components'),
    '@layout': path.resolve(cwd, './layout'),
    '@utils': path.resolve(cwd, './utils'),
    '@pages': path.resolve(cwd, './pages'),
    '@store': path.resolve(cwd, './store'),
    '@config': path.resolve(cwd, './config'),
    '@server': path.resolve(cwd, './server'),
    '@common': path.resolve(cwd, '../common'),
  });
  // eslint-disable-next-line no-param-reassign
  config.resolveLoader.alias = Object.assign({}, config.resolveLoader.alias, {
    '@component': path.resolve(cwd, './components'),
    '@layout': path.resolve(cwd, './layout'),
    '@utils': path.resolve(cwd, './utils'),
    '@pages': path.resolve(cwd, './pages'),
    '@store': path.resolve(cwd, './store'),
    '@config': path.resolve(cwd, './config'),
    '@server': path.resolve(cwd, './server'),
    '@common': path.resolve(cwd, '../common'),
  });

  return config;
};
