var _ = require('underscore');
var Runnable = require('../models/runnable');
var Base = require('./base');
var Super = Base.prototype;

module.exports = Base.extend({
  model: Runnable,
  sort: function () {
    if (arguments.length === 0 && this.params.sort && !this.comparator) {
      this.comparator = this.params.sort;
    }
    Super.sort.apply(this, arguments);
  },
  parse: function (resp) {
    if (resp.paging) {
      this.params.lastPage = resp.paging && resp.paging.lastPage;
      return resp.data;
    }
    else {
      return resp;
    }
  }
});

module.exports.id = "Runnables";