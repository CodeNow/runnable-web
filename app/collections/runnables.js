var _ = require('underscore');
var Runnable = require('../models/runnable');
var Base = require('./base');
var Super = Base.prototype;

module.exports = Base.extend({
  model: Runnable,
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