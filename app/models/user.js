var Base = require('./base');
var BaseCollection = require('../collections/base');
var Super = BaseCollection.prototype;

module.exports = Base.extend({
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
  register: function(email, password, cb) {
    cb = cb || function () {};
    this.save({
      email: email,
      password: password
    }, {
      wait: true,
      success: function(model, response, options) {
        // Track.event('User', 'Registered');
        cb();
      },
      error: function(model, body) {
        cb(body.message);
      }
    });
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
        console.log(project.id);
        debugger;
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
