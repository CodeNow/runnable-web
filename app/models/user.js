var Base = require('./base');
var BaseCollection = require('../collections/base');
var Super = BaseCollection.prototype;
var utils = require('../utils');
var _     = require('underscore');

var User = module.exports = Base.extend({
  urlRoot: '/users',
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    if (attrs.votes) {
      this.createVotesCollection(attrs.votes);
    }
    else {
      this.listenToOnce(this, 'change:votes', function (model) {
        this.createVotesCollection(model.get('votes'));
      }.bind(this));
    }
  },
  createVotesCollection: function (votes) {
    this.votes = new BaseCollection(votes, {
      app: this.app,
      model: Base,
      url: '/users/' + this.id + '/votes'
    });
  },
  isRegistered : function(){
    return this.get('permission_level') >= 1;
  },
  isModerator : function () {
    return this.get('permission_level') >= 5;
  },
  canEdit: function (model) {
    return this.isModerator() || this.isOwner(model);
  },
  register: function(email, username, password, cb) {
    cb = cb || function () {};
    var cbOptions = utils.successErrorToCB(cb);
    this.save({
      email: email,
      username: username,
      password: password
    }, {
      wait: true,
      method: 'POST',
      url   : '/users',
      success: cbOptions.success,
      error  : cbOptions.error
    });
  },
  login: function (emailUsername, password, cb) {
    cb = cb || function () {};
    var cbOptions = utils.successErrorToCB(cb);
    var self = this;
    var auth = new Base({
      email: emailUsername,
      password: password
    }, {
      url: '/token',
      app: this.app
    });
    var cbOpts = this.app.utils.successErrorToCB;
    auth.save({}, cbOpts(function (err) {
      if (err) {
        alert(err);
      }
      self.set('_id', 'me');
      self.fetch(cbOptions);
    }));
  },
  vote: function (project, cb) {
    var self = this;
    cb = cb || function(){};
    var applyVote = function () {
      var match = self.votes.findWhere({ runnable: project.id });
      if (match) {
        cb('You have already voted on this project');
      } else {
        project.incVote();
        self.votes.create({
          runnable: project.id
        }, {
          success: function () {
            cb();
          },
          error: function () {
            project.decVote();
            cb('Error voting on project');
          }
        });
      }
    };
    if (!this.votes) {
      var currentVotes = this.get('votes') || [];
      this.votes = new BaseCollection(currentVotes, {
        model: Base,
        app: this.app,
        url: '/users/' + this.id + '/votes'
      });
      this.votes.fetch();
      this.listenToOnce(this.votes, 'sync', applyVote);
    } else {
      applyVote();
    }
  },
  hasVoted: function (project, cb) {
    var self = this;
    cb = cb || function(){};
    var checkVote = function () {
      var match = self.votes.findWhere({ runnable: project.id });
      cb(null, match !== null && match !== undefined);
    };
    if (!this.votes) {
      this.createVotesCollection([]);
      this.votes.fetch();
      this.listenToOnce(this.votes, 'sync', checkVote);
    } else {
      checkVote();
    }
  },
  isOwnerOf: function (project) {
    owner = (project.toJSON) ? project.get('owner') : project.owner;
    return this.id == owner;
  }
});
module.exports.id = 'User';
