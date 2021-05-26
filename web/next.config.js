const nextConfig = require('@discuzq/cli/config/next');

module.exports = nextConfig((config) => {
    config.productionBrowserSourceMaps = true;
    config.crossOrigin = 'anonymous';
    return config;
});