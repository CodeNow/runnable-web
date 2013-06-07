var eson = require('eson');

// Point to current environment/config values
var env = process.env.NODE_ENV || 'development';

exports.get = function(env) {
  return eson()
  .use(eson.args())
  .use(eson.env())
  .use(eson.ms)
  .use(eson.replace('{RAND_NUM}', uuid.v4().split('-')[0]))
  .use(eson.replace('{HOME_DIR}', process.env.HOME))
  .use(eson.replace('{CURR_DIR}', __dirname + '../../configs'))
  .use(eson.replace('{RAND_DIR}', os.tmpDir() + '/' + uuid.v4()))
  .read(__dirname + '../../configs/' + env + '.json');
};

exports.name = env;
exports.current = exports.get(env);
