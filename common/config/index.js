const config = {
  version: 'v3.0.210727'
};

module.exports = function () {
  if (process.env.NODE_ENV === 'development') {
    return Object.assign({}, config, require('./dev'));
  }
  return Object.assign({}, config, require('./prod'));
};
