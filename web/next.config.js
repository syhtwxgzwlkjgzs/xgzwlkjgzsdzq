const nextConfig = require('@discuzq/cli/config/next');

module.exports = nextConfig((config) => {
    config.productionBrowserSourceMaps = true;
    config.crossOrigin = 'anonymous';
    // config.devIndicators = {
    //     autoPrerender: false,
    // }
    // config.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 8919 }));

    return config;
});