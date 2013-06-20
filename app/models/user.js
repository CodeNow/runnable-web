var Base = require('./base');
var BaseCollection = require('../collections/base');

module.exports = Base.extend({
  isRegistered : function(){
    return this.get('permission_level') >= 1;
  },
  isModerator : function () {
    return this.get('permission_level') >= 5;
  },
  canEdit: function (model) {
    return this.isModerator() || this.isOwner(model);
  },
  register: function(email, password, cb) {
    this.save({
      email: email,
      password: password
    }, {
      wait: true,
      success: function(model, response, options) {
        // Track.event('User', 'Registered');
        cb && cb();
      },
      error: function(model, body) {
        cb && cb(body.message);
      }
    });
  },
  vote: function (project, cb) {
    var self = this;
    var applyVote = function () {
      var match = self.votes.findWhere({ runnable: project.id });
      if (match) {
        cb && cb('You have already voted on this project');
      } else {
        self.votes.create({
          runnable: project.id
        });
        self.votes.once('sync', function () {
          cb && cb();
        });
      }
    };
    if (!this.votes) {
      this.votes = new BaseCollection([ ], {
        model: Base,
        app: this.app,
        url: '/users/' + this.id + '/votes'
      });
      this.votes.fetch();
      this.votes.once('sync', applyVote);
    } else {
      applyVote();
    }
  },
  hasVoted: function (project, cb) {
    var self = this;
    var checkVote = function () {
      var match = self.votes.findWhere({ runnable: project.id });
      cb(null, match !== null && match !== undefined);
    };
    if (!this.votes) {
      this.votes = new BaseCollection([ ], {
        app: this.app,
        model: Base,
        url: '/users/' + this.id + '/votes'
      });
      this.votes.fetch();
      this.votes.once('sync', checkVote);
    } else {
      checkVote();
    }
  }
});
module.exports.id = 'User';
