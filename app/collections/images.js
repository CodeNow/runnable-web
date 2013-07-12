var Image = require('../models/image')
  , Base = require('./base');

module.exports = Base.extend({
  model: Image,
  url: '/runnables',
  comparator: function (a, b) {
    var ret;
    ['votes', 'created'].some(function (key) {
      ret = (a.get(key) > b.get(key))
        ? -1
        : (a.get(key) < b.get(key))
          ? 1
          : 0;
      return ret; //if 0 will continue, -1 and 1 will stop some
    });
    return ret;
  }
});

module.exports.id = "Images";