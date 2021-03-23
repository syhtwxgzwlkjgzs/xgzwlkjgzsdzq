const cwd = process.cwd();
const path = require('path');

module.exports = (config) => {
  config.module.rules[0].include.push(path.resolve(cwd, '../'));
  return config;
};
