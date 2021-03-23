const nextConfig = require('@discuz/cli/config/next');
const includeFile = require('./build/include');
const alias = require('./build/alias');
module.exports = nextConfig((config) => {
  config.webpack = (conf) => {
    let nextConfig = conf;

    nextConfig = includeFile(nextConfig);
    nextConfig = alias(nextConfig);

    return nextConfig;
  };
  return config;
});
