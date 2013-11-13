var Base = require('./base');
var Super = Base.prototype;
var utils = require('../utils');
var _     = require('underscore');
var BaseCollection = require('../collections/base');

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
  isRegistered : function (){
    return this.get('permission_level') >= 1;
  },
  isVerified : function () {
    return this.get('permission_level') >= 2;
  },
  isModerator : function () {
    return this.get('permission_level') >= 5;
  },
  canEdit: function (model) {
    return this.isModerator() || this.isOwnerOf(model);
  },
  register: function(email, username, password, cb) {
    cb = cb || function () {};
    var self = this;
    var cbOpts = utils.cbOpts(cb);
    this.save({
      email: email,
      username: username,
      password: password
    }, {
      wait: true,
      method: 'PUT',
      url   : '/users/me',
      success: success,
      error  : cbOpts.error
    });
    function success () {
      cbOpts.success.apply(this, arguments);
      self.trigger('auth');
    }
  },
  login: function (emailUsername, password, cb) {
    cb = cb || function () {};
    var self=this, app=this.app, auth, data, opts;

    auth = new Base({}, { url: '/token', app:app });
    data = {
      email   : emailUsername,
      password: password
    };
    opts = utils.cbOpts(saveCallback);

    auth.save(data, opts);
    function saveCallback (err) {
      var meOpts = utils.cbOpts(cb);
      if (err) {
        cb(err);
      }
      else {
        self.fetch({
          url: '/users/me',
          success: success,
          error: meOpts.error
        });
      }
      function success () {
        meOpts.success.apply(this, arguments);
        self.trigger('auth');
      }
    }
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
      return match;
    };
    if (!this.votes) {
      this.createVotesCollection([]);
      this.votes.fetch();
      this.listenToOnce(this.votes, 'sync', checkVote);
    } else {
      return checkVote();
    }
  },
  isOwnerOf: function (model) {
    owner = (model.toJSON) ? model.get('owner') : model.owner;
    return this.id === owner;
  },
  appURL: function () {
    return '/u/'+this.get('username');
  }
});
module.exports.id = 'User';
