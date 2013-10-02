var eson = require('eson');
var os = require('os');
var path = require('path');
var env = process.env.NODE_ENV || 'production';
var commitHash = require('../../configs/commitHash'); // generated by grunt

var readConfigs = function (filename) {
  return eson()
  .use(eson.args())
  .use(eson.env())
  .use(eson.ms)
  .use(eson.replace('{HOME_DIR}', process.env.HOME))
  .use(eson.replace('{CURR_DIR}', path.resolve(path.join(__dirname, '/../configs'))))
  .use(eson.replace('{COMMIT_HASH}', commitHash))
  .read(path.resolve(path.join(__dirname, '..', '..', 'configs/', filename+'.json')));
};

module.exports = {
  readConfigs: readConfigs,
  current: readConfigs(env)
};