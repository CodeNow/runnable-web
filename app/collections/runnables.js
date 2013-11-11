var Runnable = require('../models/runnable');
var Base = require('./base');

module.exports = Base.extend({
  model: Runnable
  comparator: 'created',
  sortByCreated: function () {
    return this.sortByAttr('created');
  },
  sortByRuns: function () {
    return this.sortByAttr('runs');
  },
  sortByViews: function () {
    return this.sortByAttr('views');
  },
  sortByCopies: function () {
    return this.sortByAttr('copies');
  },
  sortByVotes: function () {
    return this.sortByAttr('votes');
  },
  sortByAttr: function (attr) {
    this.comparator = attr;
    this.sort();
    return this;
  }
});

module.exports.id = "Runnables";