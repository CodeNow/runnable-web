var eson = require('eson');
var os = require('os');
var path = require('path');
var uuid = require ('node-uuid');
var env = process.env.NODE_ENV || 'development';

var readConfigs = function (filename) {
  return eson()
  .use(eson.args())
  .use(eson.env())
  .use(eson.ms)
  .use(eson.replace('{RAND_NUM}', uuid.v4().split('-')[0]))
  .use(eson.replace('{HOME_DIR}', process.env.HOME))
  .use(eson.replace('{CURR_DIR}', path.resolve(path.join(__dirname, '/../configs'))))
  .use(eson.replace('{RAND_DIR}', os.tmpDir() + '/' + uuid.v4()))
  .read(path.resolve(path.join(__dirname, '..', '..', 'configs/', filename+'.json')));
};

var configs = module.exports = readConfigs(env);
var portArgIndex = process.argv.indexOf('--port');
if (~portArgIndex) configs.port = parseInt(process.argv[portArgIndex+1], 10);

module.exports.readConfigs = readConfigs;
module.exports.current = readConfigs(env);
