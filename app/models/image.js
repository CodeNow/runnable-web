var Runnable = require('./runnable');
var _ = require('underscore');
var Super = Runnable.prototype;

module.exports = Runnable.extend({
  urlRoot: '/runnables',
  defaults: {
    votes: 0
  },
  virtuals: function () {
    var virtuals = _.clone(_.result(Super, 'virtuals'));
    return _.extend(virtuals, {
      niceFramework : 'niceFramework'
    });
  },
  niceFramework: function () {
    var friendlyFrameworks = {
      'node.js'  : 'Node.js',
      'php'      : 'PHP',
      'python'   : 'Python'
    };
    return friendlyFrameworks[this.get('framework')];
  },
  incVote: function () {
    votes = this.get('votes') + 1;
    this.set('votes', votes);
    return this;
  },
  decVote: function () {
    votes = this.get('votes') - 1;
    this.set('votes', votes);
    return this;
  }
});

module.exports.id = "Image";