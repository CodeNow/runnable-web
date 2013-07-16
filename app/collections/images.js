var Image = require('../models/image');
var Base = require('./base');

module.exports = Base.extend({
  model: Image,
  url: '/runnables',
  comparator: function (a, b) {
    var ret;
    ['votes', 'created'].some(function (key) {
      var valA = a.get(key);
      var valB = b.get(key);
      ret = (valA > valB) ? -1 : (valA < valB) ? 1 : 0;
      return ret; //if 0 will continue, -1 and 1 will stop some
    });
    return ret;
  }
});

module.exports.id = "Images";