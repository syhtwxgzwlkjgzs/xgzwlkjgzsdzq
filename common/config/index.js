const config = {};

module.exports = function () {
  if (process.env.NODE_ENV === 'development') {
    return Object.assign({}, config, require('./dev'));
  }
  return Object.assign({}, config, require('./prod'));
};
